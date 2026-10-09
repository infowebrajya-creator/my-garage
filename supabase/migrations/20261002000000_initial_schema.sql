-- ============================================================================
-- MIGRATION 00: INITIAL SCHEMA, EXTENSIONS & MULTI-TENANT TABLES
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- 1. PROFILES TABLE (Extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email CITEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  currency TEXT NOT NULL DEFAULT 'INR',
  date_format TEXT NOT NULL DEFAULT 'DD/MM/YYYY',
  notifications JSONB NOT NULL DEFAULT '{"email": true, "sms": true, "whatsapp": false}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ACCOUNTS TABLE (Multi-tenant Account / Organization Container)
CREATE TABLE public.accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'personal' CHECK (type IN ('personal', 'family', 'commercial')),
  primary_owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ACCOUNT MEMBERSHIPS TABLE (Role-Based Access Control)
CREATE TABLE public.account_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(account_id, user_id)
);

-- 4. SUBSCRIPTION PLANS TABLE (Pricing Tiers: Free vs Premium)
CREATE TABLE public.subscription_plans (
  id TEXT PRIMARY KEY, -- 'free_plan', 'premium_yearly'
  name TEXT NOT NULL,
  description TEXT,
  price_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'INR',
  billing_interval TEXT NOT NULL CHECK (billing_interval IN ('month', 'year', 'lifetime')),
  max_vehicles INT NOT NULL DEFAULT 2, -- 2 for Free, -1 for Unlimited
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert Default Base Subscription Plans
INSERT INTO public.subscription_plans (id, name, description, price_amount, currency, billing_interval, max_vehicles, features)
VALUES 
  ('free_plan', 'Free Starter', 'Free plan for personal use up to 2 vehicles', 0.00, 'INR', 'year', 2, '["2_vehicles", "basic_locker", "basic_reminders"]'::jsonb),
  ('premium_yearly', 'Premium Yearly Pro', 'Unlimited vehicles, advanced expense analytics, and priority alerts', 1499.00, 'INR', 'year', -1, '["unlimited_vehicles", "full_locker", "csv_export", "priority_alerts"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 5. SUBSCRIPTIONS TABLE
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL UNIQUE REFERENCES public.accounts(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'trailing')),
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. VEHICLES TABLE
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Car', 'Bike', 'Scooter', 'Other')),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid')),
  manufacturing_year INT NOT NULL CHECK (manufacturing_year >= 1900 AND manufacturing_year <= 2100),
  purchase_date DATE NOT NULL,
  odometer INT NOT NULL DEFAULT 0 CHECK (odometer >= 0),
  notes TEXT,
  image_url TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. VEHICLE DOCUMENTS TABLE
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('RC', 'Insurance', 'PUC', 'Driving Licence', 'Road Tax', 'Fitness Certificate', 'Other')),
  document_number TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  file_path TEXT, -- Bucket key path: {account_id}/{vehicle_id}/{document_id}/{filename}
  file_name TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. SERVICE HISTORY TABLE
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  service_date DATE NOT NULL,
  odometer INT NOT NULL CHECK (odometer >= 0),
  service_type TEXT NOT NULL CHECK (service_type IN ('General Service', 'Oil Change', 'Tyre Replacement', 'Battery', 'Repair', 'Other')),
  garage_name TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (amount >= 0),
  next_service_date DATE,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. EXPENSES TABLE
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE, -- Explicit Foreign Key preventing orphans
  category TEXT NOT NULL CHECK (category IN ('Fuel', 'Service & Maintenance', 'Insurance', 'PUC', 'Road Tax', 'Repairs', 'Accessories', 'Other')),
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  date DATE NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('UPI', 'Credit Card', 'Debit Card', 'Cash', 'Net Banking')),
  description TEXT NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. REMINDERS TABLE
CREATE TABLE public.reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Insurance renewal', 'PUC renewal', 'Road tax', 'Vehicle servicing', 'Fitness certificate', 'Custom')),
  due_date DATE NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. NOTIFICATION LOGS TABLE (Dispatched Email / SMS / WhatsApp Alerts)
CREATE TABLE public.notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  reminder_id UUID REFERENCES public.reminders(id) ON DELETE SET NULL,
  document_id UUID REFERENCES public.documents(id) ON DELETE SET NULL,
  recipient_email TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'whatsapp')),
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'pending')),
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  error_message TEXT
);

-- 12. PAYMENT RECORDS TABLE (Verified Invoice Receipts)
CREATE TABLE public.payment_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL CHECK (status IN ('succeeded', 'failed', 'refunded', 'pending')),
  payment_provider TEXT NOT NULL DEFAULT 'stripe',
  provider_transaction_id TEXT NOT NULL UNIQUE,
  receipt_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. WEBHOOK EVENTS TABLE (Idempotent Webhook Log)
CREATE TABLE public.webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id TEXT NOT NULL UNIQUE, -- Provider Event ID (e.g. evt_12345)
  provider TEXT NOT NULL DEFAULT 'stripe',
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. AUDIT LOGS TABLE
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR HIGH-PERFORMANCE MULTI-TENANT QUERYING
-- ============================================================================
CREATE INDEX idx_account_memberships_user ON public.account_memberships(user_id);
CREATE INDEX idx_account_memberships_account ON public.account_memberships(account_id);
CREATE INDEX idx_vehicles_account ON public.vehicles(account_id);
CREATE INDEX idx_documents_account_vehicle ON public.documents(account_id, vehicle_id);
CREATE INDEX idx_documents_expiry ON public.documents(expiry_date);
CREATE INDEX idx_services_account_vehicle ON public.services(account_id, vehicle_id);
CREATE INDEX idx_expenses_account_vehicle ON public.expenses(account_id, vehicle_id);
CREATE INDEX idx_expenses_service_id ON public.expenses(service_id);
CREATE INDEX idx_reminders_account_due ON public.reminders(account_id, due_date, completed);
