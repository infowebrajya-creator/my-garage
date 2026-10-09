# 🛡️ MyGarage by WebRajya — Supabase Security & Threat Audit Checklist

This security checklist documents the threat model, Row Level Security (RLS) rules, access control matrices, storage bucket policies, and security controls for **MyGarage SaaS**.

---

## 1. 📊 Security Status & Verification Matrix

| Security Domain | Status | Implementation Details |
| :--- | :---: | :--- |
| **Multi-Tenant Account Isolation** | 🛡️ Designed | Every domain entity (`vehicles`, `documents`, `services`, `expenses`, `reminders`) is linked via `account_id` foreign key. |
| **Row Level Security (RLS)** | 🛡️ Designed | RLS enabled on all 14 tables with explicit `SELECT`, `INSERT`, `UPDATE`, `DELETE` policies. |
| **Non-Recursive RLS Helpers** | 🛡️ Designed | `public.is_account_member(acc_id, role)` `SECURITY DEFINER` function with explicit `SET search_path = public, pg_temp`. |
| **Privilege Escalation Defense** | 🛡️ Designed | Users cannot insert/update `account_memberships` roles to `'owner'` or `'admin'`. |
| **Atomic User Bootstrap** | 🛡️ Designed | Trigger `public.handle_new_user()` on `auth.users` insert creates profile, personal account, owner membership, and free plan atomically. |
| **Private Document Storage** | 🛡️ Designed | Private bucket `vehicle-documents` restricted to authorized account members via `{account_id}/{vehicle_id}/{document_id}/{filename}` path checks. |
| **Plan Entitlement Enforcement** | 🛡️ Designed | Database trigger `public.check_vehicle_plan_limit()` checks subscription max vehicle allowance before inserting a vehicle. |
| **Webhook Idempotency** | 🛡️ Designed | Table `public.webhook_events` tracks provider event IDs to prevent duplicate payment processing. |
| **Frontend Prototype Mode** | ✅ Active | Active app runs safely on `localStorage` using repository pattern (`IGarageRepository`). Zero passwords stored in browser storage. |

---

## 2. 👥 Role-Based Access Control (RBAC) Matrix

| Role | View Vehicles / Docs | Create / Edit Records | Invite Team Members | Modify Account / Billing | Delete Vehicles |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Owner** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Admin** | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| **Member** | ✅ Yes | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Viewer** | ✅ Yes | ❌ Read Only | ❌ No | ❌ No | ❌ No |

---

## 3. 🛡️ RLS Policy Verification Checklist

### Table Policies & Enforcement

- [x] **`public.profiles`**:
  - `SELECT`: `auth.uid() = id` (Users only view own profile)
  - `UPDATE`: `auth.uid() = id` (Users only update own profile)
- [x] **`public.accounts`**:
  - `SELECT`: `public.is_account_member(id, 'viewer')`
  - `UPDATE`: `public.is_account_member(id, 'owner')`
- [x] **`public.account_memberships`**:
  - `SELECT`: `public.is_account_member(account_id, 'viewer')`
  - `INSERT`: `public.is_account_member(account_id, 'admin') AND role IN ('member', 'viewer')`
  - `UPDATE`: `public.is_account_member(account_id, 'admin') AND role IN ('admin', 'member', 'viewer')`
- [x] **`public.vehicles`**, **`documents`**, **`services`**, **`expenses`**, **`reminders`**:
  - `SELECT`: `public.is_account_member(account_id, 'viewer')`
  - `INSERT/UPDATE`: `public.is_account_member(account_id, 'member')`
  - `DELETE`: `public.is_account_member(account_id, 'admin')` or `'member'`
- [x] **`public.subscriptions`**, **`payment_records`**:
  - `SELECT`: `public.is_account_member(account_id, 'viewer')`
  - `INSERT/UPDATE/DELETE`: **Disabled for client keys** (Writes executed server-side via Supabase Service Role Key only).

---

## 4. 🗂️ Storage Security Rules (`vehicle-documents`)

- **Bucket Type**: **Private** (`public = false`)
- **Allowed MIME Types**: `application/pdf`, `image/jpeg`, `image/png`, `image/webp`
- **File Size Limit**: 10 MB per file
- **Path Pattern**: `{account_id}/{vehicle_id}/{document_id}/{filename}`
- **Storage Policy**:
  ```sql
  CREATE POLICY "Storage SELECT: Account members view documents"
    ON storage.objects FOR SELECT
    USING (
      bucket_id = 'vehicle-documents' AND
      public.is_account_member((storage.foldername(name))[1]::uuid, 'viewer')
    );
  ```

---

## 5. 🖥️ Client vs Server Responsibility Separation

| Operation | Client Side (Browser) | Server Side (Next.js Middleware / Supabase Edge Functions) |
| :--- | :---: | :---: |
| UI Rendering & Forms | ✅ Yes | ❌ No |
| Interactive CSV Export | ✅ Yes | ❌ No |
| Password Validation UI | ✅ Yes | ❌ No |
| Session Token Verification | ❌ No | ✅ Yes (Next.js Server Middleware & RLS) |
| Subscription Status Changes | ❌ No | ✅ Yes (Webhook Handler / Service Role Key) |
| Payment Gateway Webhooks | ❌ No | ✅ Yes (Stripe Signature Verification) |
| Automated Email Alerts | ❌ No | ✅ Yes (Supabase Cron Edge Function) |

---

## 6. 🧪 Environment Verification Status

- **Designed but Not Executed**: SQL Schemas, RLS Policies, Storage Rules, Webhook Handlers.
- **Tested Locally**: Frontend UI, `LocalStorageRepository`, CSV Export, Interactive Modals, Next.js Build.
- **Verified against Live Supabase**: Pending Stage 2 deployment.
