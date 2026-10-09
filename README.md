# 🚗 MyGarage — Vehicle Management SaaS by WebRajya

A modern, responsive, automotive-inspired SaaS web application built by **WebRajya** for vehicle owners to manage their cars, motorcycles, scooters, registration documents, periodic service history, fuel and maintenance expenses, and critical expiry reminders.

---

## 🚀 Technology Stack

- **Framework**: Next.js (App Router, Turbopack)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 with custom automotive theme tokens
- **Icons**: Lucide React (`lucide-react`)
- **State & Architecture**: Decoupled Repository Pattern (`IGarageRepository` / `LocalStorageRepository`)
- **Persistence**: Browser `localStorage` with safe fallbacks and multi-tab synchronization (`storage` event listener)

---

## 🛠️ Getting Started Locally

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation & Execution

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Validate TypeScript & Build**:
   ```bash
   npx tsc --noEmit
   npm run build
   ```

---

## ✨ Features Breakdown

### 1. Dashboard Overview (`/dashboard`)
- **KPI Summary Cards**: Total Vehicles, Active Documents, Action-Required Expiries, Total Maintenance Expenses.
- **Interactive Financial Visuals**: Monthly Spending Trend Bar Chart + Category Distribution Progress Bars.
- **Fleet Cards & Reminders**: Real-time health badges, document expiry alerts, and instant-complete checkboxes.

### 2. Vehicle Fleet Management (`/vehicles` & `/vehicles/[id]`)
- **Grid & List Views**: Search and filter by Vehicle Type (Car, Bike, Scooter, Commercial) and Fuel Engine (Petrol, Diesel, EV, CNG, Hybrid).
- **Full CRUD**: Add, edit, view specs, and delete vehicles with cascading cleanup of associated documents, service logs, and expense records.
- **Vehicle Detail View**: Tabs for Overview, Documents, Service History, Expenses, and Reminders, plus a **Quick Odometer Update Modal**.

### 3. Document Locker (`/documents`)
- Track RC, Insurance, PUC, Driving Licence, Road Tax, Fitness Certificate, and Custom documents.
- Filter by vehicle, type, and status (**Valid**, **Expiring Soon**, **Expired**).
- Dynamic days-remaining counters and mock file attachment indicator.

### 4. Service History Ledger (`/services`)
- Log periodic servicing, oil changes, tyre replacements, battery service, and repairs.
- Displays invoice cost, odometer reading, garage name, description, and next recommended service date.
- Auto-generates and synchronizes corresponding service expenses.

### 5. Expense Tracking & CSV Export (`/expenses`)
- Categorize spending: Fuel, Service & Maintenance, Insurance, PUC, Road Tax, Repairs, Accessories, Other.
- **One-Click CSV Export**: Download filtered transactions to a UTF-8 BOM formatted `.csv` spreadsheet for tax accounting.

### 6. Expiry Reminders (`/reminders`)
- Filter reminders by status (Upcoming, Overdue, Completed) and Priority (High, Medium, Low).
- Instant checkbox completion state with persistence.

### 7. Billing & SaaS Plans (`/billing`)
- **Free Tier** vs. **WebRajya Premium Plan** comparison.
- Monthly & Annual cycle pricing toggle, feature matrix table, and FAQ accordion.

### 8. Settings & Profile (`/settings`)
- Update owner name, email, phone, currency (INR ₹), date formats, and notification channel preferences (Email, SMS, WhatsApp UI).
- Reset Demo Data button to restore initial sample datasets.

### 9. Authentication UI (`/auth/...`)
- Polished Login, Signup, and Forgot Password screens with clear disclaimers stating mock frontend authentication is active.

---

## 🔒 Security & Privacy Notice

- **Mock Authentication**: Client-side authentication is for frontend demonstration only. No real passwords or sensitive tokens are stored in `localStorage`.
- **Local Document Storage**: Uploaded document filenames and metadata are stored exclusively in browser local storage. Files are not sent to any cloud server.
- **Production Controls Required**: When connected to Supabase, authentication will be secured via Supabase Auth (OAuth/JWT), Row Level Security (RLS) policies, and private encrypted Storage buckets.

---

## 📐 Supabase Readiness & Repository Architecture

The codebase separates UI components from data persistence through the **`IGarageRepository`** interface (`lib/repository/types.ts`).

Current implementation uses `LocalStorageRepository`. To integrate Supabase:
1. Create `lib/repository/supabaseRepository.ts` implementing `IGarageRepository`.
2. Connect Supabase Client (`@supabase/supabase-js`) and call database tables.
3. Re-export `supabaseRepository` as `garageRepository` in `lib/repository/index.ts`.

See [SUPABASE_INTEGRATION_PLAN.md](./SUPABASE_INTEGRATION_PLAN.md) for full SQL schemas, RLS policies, and migration guides.

---

## 🗝️ Environment Variables (Future Stage 2)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 📋 Known Issues & Remaining Tasks

- **Backend Integration**: Real database tables, Supabase Auth, payment gateways, and automated email/SMS dispatchers will be enabled upon backend connection.
- **Document Files**: Binary file upload streams will be connected to Supabase Private Storage buckets in Stage 2.
