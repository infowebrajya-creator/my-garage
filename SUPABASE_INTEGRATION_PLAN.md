# ⚡ MyGarage by WebRajya — Supabase Integration & Backend Migration Architecture Plan

This document outlines the architectural blueprint, SQL schema, Row Level Security (RLS) policies, storage bucket rules, and step-by-step migration plan for transitioning **MyGarage** from browser `localStorage` to **Supabase**.

---

## 1. 🗄️ Database Schemas & DDL Specifications

Below are the PostgreSQL DDL table definitions required in Supabase.

```sql
-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / USER SETTINGS TABLE
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  currency TEXT DEFAULT 'INR',
  date_format TEXT DEFAULT 'DD/MM/YYYY',
  avatar_url TEXT,
  notifications JSONB DEFAULT '{"email": true, "sms": true, "whatsapp": false}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. VEHICLES TABLE
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Car', 'Bike', 'Scooter', 'Other')),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid')),
  manufacturing_year INT NOT NULL,
  purchase_date DATE NOT NULL,
  odometer INT DEFAULT 0,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DOCUMENTS TABLE
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('RC', 'Insurance', 'PUC', 'Driving Licence', 'Road Tax', 'Fitness Certificate', 'Other')),
  document_number TEXT NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  file_path TEXT, -- Storage Bucket Object Path
  file_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SERVICE RECORDS TABLE
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  service_date DATE NOT NULL,
  odometer INT NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('General Service', 'Oil Change', 'Tyre Replacement', 'Battery', 'Repair', 'Other')),
  garage_name TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  next_service_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EXPENSES TABLE
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('Fuel', 'Service & Maintenance', 'Insurance', 'PUC', 'Road Tax', 'Repairs', 'Accessories', 'Other')),
  amount NUMERIC(10, 2) NOT NULL,
  date DATE NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('UPI', 'Credit Card', 'Debit Card', 'Cash', 'Net Banking')),
  description TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. REMINDERS TABLE
CREATE TABLE public.reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Insurance renewal', 'PUC renewal', 'Road tax', 'Vehicle servicing', 'Fitness certificate', 'Custom')),
  due_date DATE NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
  completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2. 🔐 Security, Row Level Security (RLS) & Account Isolation

To guarantee complete tenant data isolation, RLS must be enabled on every table. Users will only ever access their own records based on `auth.uid()`.

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Vehicles Policies
CREATE POLICY "Users can manage own vehicles" ON public.vehicles
  FOR ALL USING (auth.uid() = user_id);

-- 3. Documents Policies
CREATE POLICY "Users can manage own documents" ON public.documents
  FOR ALL USING (auth.uid() = user_id);

-- 4. Services Policies
CREATE POLICY "Users can manage own services" ON public.services
  FOR ALL USING (auth.uid() = user_id);

-- 5. Expenses Policies
CREATE POLICY "Users can manage own expenses" ON public.expenses
  FOR ALL USING (auth.uid() = user_id);

-- 6. Reminders Policies
CREATE POLICY "Users can manage own reminders" ON public.reminders
  FOR ALL USING (auth.uid() = user_id);
```

---

## 3. 📁 Private Document Storage Bucket Policies

Vehicles registration cards, insurance PDFs, and tax documents contain sensitive personally identifiable information (PII). They must be saved in a **Private Storage Bucket**.

```sql
-- Create Private Storage Bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('vehicle-documents', 'vehicle-documents', false);

-- Storage Policy: Users can only upload and read files inside their own user_id directory
CREATE POLICY "Users can upload own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'vehicle-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can read own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'vehicle-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'vehicle-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## 4. 🔄 Migration Strategy: LocalStorage to Supabase

The application uses the `IGarageRepository` pattern (`lib/repository/types.ts`).

### Migration Steps:
1. **Create `lib/repository/supabaseRepository.ts`**:
   Implement `IGarageRepository` using `@supabase/supabase-js`.
2. **First-Time Login Sync Prompt**:
   Upon first authenticated user login, detect if `localStorage` contains guest data (`mygarage_vehicles_v1`).
3. **Automated Migration Tool**:
   Provide a one-click modal allowing users to bulk-upload their offline localStorage vehicles, documents, expenses, and service logs into Supabase.
4. **Switch Active Repository**:
   Change export in `lib/repository/index.ts` from `LocalStorageRepository` to `SupabaseRepository`. Zero component code changes required!

---

## 5. 💳 Future Phase: Payments & Email Reminders

1. **Stripe / Razorpay Subscription Checkout**:
   - Store customer `stripe_customer_id` & `subscription_status` in `public.profiles`.
   - Webhooks update user tier between `Free` and `Premium`.

2. **Automated Email & WhatsApp Alerts (Cron / Edge Functions)**:
   - Deploy Supabase Edge Function triggered daily at 08:00 UTC.
   - Query documents where `expiry_date = CURRENT_DATE + INTERVAL '30 days'` or `'7 days'`.
   - Send notifications using Resend API / Twilio WhatsApp API.
