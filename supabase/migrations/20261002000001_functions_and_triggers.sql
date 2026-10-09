-- ============================================================================
-- MIGRATION 01: SECURITY DEFINER HELPERS & ATOMIC BOOTSTRAP TRIGGERS
-- ============================================================================

-- 1. NON-RECURSIVE SECURITY DEFINER HELPER: IS ACCOUNT MEMBER
CREATE OR REPLACE FUNCTION public.is_account_member(
  target_account_id UUID,
  required_role TEXT DEFAULT 'viewer'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  user_role TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  SELECT role INTO user_role
  FROM public.account_memberships
  WHERE account_id = target_account_id AND user_id = auth.uid();

  IF user_role IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Role Hierarchy check
  IF required_role = 'viewer' THEN
    RETURN user_role IN ('owner', 'admin', 'member', 'viewer');
  ELSIF required_role = 'member' THEN
    RETURN user_role IN ('owner', 'admin', 'member');
  ELSIF required_role = 'admin' THEN
    RETURN user_role IN ('owner', 'admin');
  ELSIF required_role = 'owner' THEN
    RETURN user_role = 'owner';
  END IF;

  RETURN FALSE;
END;
$$;

-- 2. HELPER FUNCTION: GET USER ACCOUNT IDS
CREATE OR REPLACE FUNCTION public.get_user_account_ids()
RETURNS TABLE (account_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN QUERY
  SELECT am.account_id
  FROM public.account_memberships am
  WHERE am.user_id = auth.uid();
END;
$$;

-- 3. ATOMIC USER BOOTSTRAP TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  new_account_id UUID;
  user_name TEXT;
BEGIN
  user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1));

  -- Step A: Insert Profile
  INSERT INTO public.profiles (id, full_name, email, phone, avatar_url)
  VALUES (
    NEW.id,
    user_name,
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    updated_at = NOW();

  -- Step B: Create Default Personal Account
  INSERT INTO public.accounts (name, type, primary_owner_id)
  VALUES (user_name || '''s Garage', 'personal', NEW.id)
  RETURNING id INTO new_account_id;

  -- Step C: Assign Account Owner Membership
  INSERT INTO public.account_memberships (account_id, user_id, role)
  VALUES (new_account_id, NEW.id, 'owner');

  -- Step D: Create Default Free Subscription
  INSERT INTO public.subscriptions (
    account_id,
    plan_id,
    status,
    current_period_start,
    current_period_end
  )
  VALUES (
    new_account_id,
    'free_plan',
    'active',
    NOW(),
    NOW() + INTERVAL '100 years'
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'User bootstrap failed for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Bind User Bootstrap Trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. SERVICE EXPENSE AUTO-SYNC TRIGGER
CREATE OR REPLACE FUNCTION public.sync_service_expense()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    IF NEW.amount > 0 THEN
      INSERT INTO public.expenses (
        account_id,
        vehicle_id,
        service_id,
        category,
        amount,
        date,
        payment_method,
        description,
        notes,
        created_by
      ) VALUES (
        NEW.account_id,
        NEW.vehicle_id,
        NEW.id,
        'Service & Maintenance',
        NEW.amount,
        NEW.service_date,
        'UPI',
        NEW.service_type || ' - ' || NEW.garage_name,
        NEW.description,
        NEW.created_by
      );
    END IF;
    RETURN NEW;

  ELSIF (TG_OP = 'UPDATE') THEN
    UPDATE public.expenses
    SET
      vehicle_id = NEW.vehicle_id,
      amount = NEW.amount,
      date = NEW.service_date,
      description = NEW.service_type || ' - ' || NEW.garage_name,
      notes = NEW.description,
      updated_at = NOW()
    WHERE service_id = NEW.id;
    RETURN NEW;

  ELSIF (TG_OP = 'DELETE') THEN
    DELETE FROM public.expenses WHERE service_id = OLD.id;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$;

-- Bind Service Expense Sync Trigger
DROP TRIGGER IF EXISTS trg_sync_service_expense ON public.services;
CREATE TRIGGER trg_sync_service_expense
  AFTER INSERT OR UPDATE OR DELETE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.sync_service_expense();
