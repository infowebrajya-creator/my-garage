-- ============================================================================
-- MIGRATION 02: ROW LEVEL SECURITY (RLS) POLICIES & PLAN ENTITLEMENT CHECKS
-- ============================================================================

-- Enable RLS on all domain tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 1. PROFILES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Profiles SELECT: Users view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Profiles UPDATE: Users update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- 2. ACCOUNTS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Accounts SELECT: Members view accessible accounts"
  ON public.accounts FOR SELECT
  USING (public.is_account_member(id, 'viewer'));

CREATE POLICY "Accounts UPDATE: Owners update account details"
  ON public.accounts FOR UPDATE
  USING (public.is_account_member(id, 'owner'))
  WITH CHECK (public.is_account_member(id, 'owner'));

-- ----------------------------------------------------------------------------
-- 3. ACCOUNT MEMBERSHIPS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Memberships SELECT: Members view account team"
  ON public.account_memberships FOR SELECT
  USING (public.is_account_member(account_id, 'viewer'));

CREATE POLICY "Memberships INSERT: Admins invite new members"
  ON public.account_memberships FOR INSERT
  WITH CHECK (
    public.is_account_member(account_id, 'admin') AND
    role IN ('member', 'viewer') -- Prevents self-assigning 'owner' or 'admin'
  );

CREATE POLICY "Memberships UPDATE: Admins modify roles"
  ON public.account_memberships FOR UPDATE
  USING (public.is_account_member(account_id, 'admin'))
  WITH CHECK (
    public.is_account_member(account_id, 'admin') AND
    role IN ('admin', 'member', 'viewer')
  );

CREATE POLICY "Memberships DELETE: Admins remove members"
  ON public.account_memberships FOR DELETE
  USING (public.is_account_member(account_id, 'admin'));

-- ----------------------------------------------------------------------------
-- 4. SUBSCRIPTION PLANS POLICIES (Read-Only for Clients)
-- ----------------------------------------------------------------------------
CREATE POLICY "Plans SELECT: Anyone can view active subscription plans"
  ON public.subscription_plans FOR SELECT
  USING (active = true);

-- ----------------------------------------------------------------------------
-- 5. SUBSCRIPTIONS POLICIES (Read-Only for Clients, Writes Server-Side Only)
-- ----------------------------------------------------------------------------
CREATE POLICY "Subscriptions SELECT: Members view account subscription"
  ON public.subscriptions FOR SELECT
  USING (public.is_account_member(account_id, 'viewer'));

-- ----------------------------------------------------------------------------
-- 6. VEHICLES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Vehicles SELECT: Members view account vehicles"
  ON public.vehicles FOR SELECT
  USING (public.is_account_member(account_id, 'viewer'));

CREATE POLICY "Vehicles INSERT: Members add vehicles"
  ON public.vehicles FOR INSERT
  WITH CHECK (public.is_account_member(account_id, 'member'));

CREATE POLICY "Vehicles UPDATE: Members update vehicles"
  ON public.vehicles FOR UPDATE
  USING (public.is_account_member(account_id, 'member'))
  WITH CHECK (public.is_account_member(account_id, 'member'));

CREATE POLICY "Vehicles DELETE: Admins delete vehicles"
  ON public.vehicles FOR DELETE
  USING (public.is_account_member(account_id, 'admin'));

-- VEHICLE PLAN ENTITLEMENT LIMIT TRIGGER
CREATE OR REPLACE FUNCTION public.check_vehicle_plan_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  current_count INT;
  plan_limit INT;
BEGIN
  -- Fetch Plan Limit
  SELECT sp.max_vehicles INTO plan_limit
  FROM public.subscriptions s
  JOIN public.subscription_plans sp ON s.plan_id = sp.id
  WHERE s.account_id = NEW.account_id AND s.status = 'active';

  -- Default to Free Plan limit (2) if no active subscription found
  IF plan_limit IS NULL THEN
    plan_limit := 2;
  END IF;

  -- Unlimited Plan (-1) bypasses check
  IF plan_limit = -1 THEN
    RETURN NEW;
  END IF;

  -- Count existing vehicles
  SELECT COUNT(*) INTO current_count
  FROM public.vehicles
  WHERE account_id = NEW.account_id;

  IF current_count >= plan_limit THEN
    RAISE EXCEPTION 'Vehicle creation limit reached for your current subscription plan (% max vehicles allowed). Upgrade to Premium for unlimited vehicles.', plan_limit;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_check_vehicle_limit ON public.vehicles;
CREATE TRIGGER trg_check_vehicle_limit
  BEFORE INSERT ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.check_vehicle_plan_limit();

-- ----------------------------------------------------------------------------
-- 7. DOCUMENTS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Documents SELECT: Members view account documents"
  ON public.documents FOR SELECT
  USING (public.is_account_member(account_id, 'viewer'));

CREATE POLICY "Documents INSERT: Members upload documents"
  ON public.documents FOR INSERT
  WITH CHECK (public.is_account_member(account_id, 'member'));

CREATE POLICY "Documents UPDATE: Members update documents"
  ON public.documents FOR UPDATE
  USING (public.is_account_member(account_id, 'member'))
  WITH CHECK (public.is_account_member(account_id, 'member'));

CREATE POLICY "Documents DELETE: Members delete documents"
  ON public.documents FOR DELETE
  USING (public.is_account_member(account_id, 'member'));

-- ----------------------------------------------------------------------------
-- 8. SERVICES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Services SELECT: Members view account services"
  ON public.services FOR SELECT
  USING (public.is_account_member(account_id, 'viewer'));

CREATE POLICY "Services INSERT: Members log services"
  ON public.services FOR INSERT
  WITH CHECK (public.is_account_member(account_id, 'member'));

CREATE POLICY "Services UPDATE: Members update services"
  ON public.services FOR UPDATE
  USING (public.is_account_member(account_id, 'member'))
  WITH CHECK (public.is_account_member(account_id, 'member'));

CREATE POLICY "Services DELETE: Members delete services"
  ON public.services FOR DELETE
  USING (public.is_account_member(account_id, 'member'));

-- ----------------------------------------------------------------------------
-- 9. EXPENSES POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Expenses SELECT: Members view account expenses"
  ON public.expenses FOR SELECT
  USING (public.is_account_member(account_id, 'viewer'));

CREATE POLICY "Expenses INSERT: Members log expenses"
  ON public.expenses FOR INSERT
  WITH CHECK (public.is_account_member(account_id, 'member'));

CREATE POLICY "Expenses UPDATE: Members update expenses"
  ON public.expenses FOR UPDATE
  USING (public.is_account_member(account_id, 'member'))
  WITH CHECK (public.is_account_member(account_id, 'member'));

CREATE POLICY "Expenses DELETE: Members delete expenses"
  ON public.expenses FOR DELETE
  USING (public.is_account_member(account_id, 'member'));

-- ----------------------------------------------------------------------------
-- 10. REMINDERS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Reminders SELECT: Members view account reminders"
  ON public.reminders FOR SELECT
  USING (public.is_account_member(account_id, 'viewer'));

CREATE POLICY "Reminders INSERT: Members create reminders"
  ON public.reminders FOR INSERT
  WITH CHECK (public.is_account_member(account_id, 'member'));

CREATE POLICY "Reminders UPDATE: Members update reminders"
  ON public.reminders FOR UPDATE
  USING (public.is_account_member(account_id, 'member'))
  WITH CHECK (public.is_account_member(account_id, 'member'));

CREATE POLICY "Reminders DELETE: Members delete reminders"
  ON public.reminders FOR DELETE
  USING (public.is_account_member(account_id, 'member'));

-- ----------------------------------------------------------------------------
-- 11. PAYMENT RECORDS POLICIES (Read-Only for Members)
-- ----------------------------------------------------------------------------
CREATE POLICY "Payments SELECT: Members view account payment history"
  ON public.payment_records FOR SELECT
  USING (public.is_account_member(account_id, 'viewer'));

-- ----------------------------------------------------------------------------
-- 12. AUDIT LOGS POLICIES (Read-Only for Admins)
-- ----------------------------------------------------------------------------
CREATE POLICY "Audit Logs SELECT: Admins view account audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.is_account_member(account_id, 'admin'));
