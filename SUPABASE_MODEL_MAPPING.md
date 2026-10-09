# 🗺️ MyGarage by WebRajya — TypeScript Model to Supabase Database Mapping

This document details the exact mapping between frontend TypeScript interfaces (`types/index.ts`) and PostgreSQL database tables in Supabase.

---

## 1. 👤 User Settings & Profile Mapping

### Frontend Interface: `UserSettings` (`types/index.ts`)
### Database Tables: `public.profiles` & `public.accounts`

| Frontend TypeScript Field | PostgreSQL Column | Data Type | Database Table | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `name` | `full_name` | `TEXT` | `public.profiles` | User's full display name |
| `email` | `email` | `CITEXT` | `public.profiles` | User's email address |
| `phone` | `phone` | `TEXT` | `public.profiles` | Contact phone number |
| `avatarUrl` | `avatar_url` | `TEXT` | `public.profiles` | Profile photo image URL |
| `currency` | `currency` | `TEXT` | `public.profiles` | Default `INR` (₹) or `USD` ($) |
| `dateFormat` | `date_format` | `TEXT` | `public.profiles` | Default `DD/MM/YYYY` |
| `notifications.email` | `notifications->>'email'` | `JSONB` | `public.profiles` | Email alert preference |
| `notifications.sms` | `notifications->>'sms'` | `JSONB` | `public.profiles` | SMS alert preference |
| `notifications.whatsapp` | `notifications->>'whatsapp'` | `JSONB` | `public.profiles` | WhatsApp alert preference |

---

## 2. 🚗 Vehicle Mapping

### Frontend Interface: `Vehicle` (`types/index.ts`)
### Database Table: `public.vehicles`

| Frontend TypeScript Field | PostgreSQL Column | Data Type | Constraints & Notes |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `UUID` | Primary Key (`uuid_generate_v4()`) |
| N/A | `account_id` | `UUID` | Foreign Key `public.accounts(id)` ON DELETE CASCADE |
| `name` | `name` | `TEXT` | Vehicle display nickname |
| `type` | `type` | `TEXT` | `CHECK (type IN ('Car', 'Bike', 'Scooter', 'Other'))` |
| `brand` | `brand` | `TEXT` | Manufacturer brand |
| `model` | `model` | `TEXT` | Vehicle variant / model |
| `registrationNumber` | `registration_number` | `TEXT` | License plate number |
| `fuelType` | `fuel_type` | `TEXT` | `CHECK (fuel_type IN ('Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'))` |
| `year` | `manufacturing_year` | `INT` | Manufacturing year |
| `purchaseDate` | `purchase_date` | `DATE` | Purchase date (`YYYY-MM-DD`) |
| `odometer` | `odometer` | `INT` | Current odometer reading (KM) |
| `notes` | `notes` | `TEXT` | Optional vehicle notes |
| `imageUrl` | `image_url` | `TEXT` | Optional vehicle photo URL |
| `createdAt` | `created_at` | `TIMESTAMPTZ` | Timestamp record created |

---

## 3. 📄 Document Locker Mapping

### Frontend Interface: `DocumentRecord` (`types/index.ts`)
### Database Table: `public.documents`

| Frontend TypeScript Field | PostgreSQL Column | Data Type | Constraints & Notes |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `UUID` | Primary Key (`uuid_generate_v4()`) |
| N/A | `account_id` | `UUID` | Foreign Key `public.accounts(id)` ON DELETE CASCADE |
| `vehicleId` | `vehicle_id` | `UUID` | Foreign Key `public.vehicles(id)` ON DELETE CASCADE |
| `type` | `type` | `TEXT` | `CHECK (type IN ('RC', 'Insurance', 'PUC', 'Driving Licence', 'Road Tax', 'Fitness Certificate', 'Other'))` |
| `documentNumber` | `document_number` | `TEXT` | Policy / Certificate serial number |
| `issueDate` | `issue_date` | `DATE` | Document issue date |
| `expiryDate` | `expiry_date` | `DATE` | Expiration date |
| `fileName` | `file_name` | `TEXT` | Display filename |
| N/A | `file_path` | `TEXT` | Storage Bucket Object Key Path |
| `notes` | `notes` | `TEXT` | Coverage notes |
| `createdAt` | `created_at` | `TIMESTAMPTZ` | Timestamp created |

---

## 4. 🔧 Service History Mapping

### Frontend Interface: `ServiceRecord` (`types/index.ts`)
### Database Table: `public.services`

| Frontend TypeScript Field | PostgreSQL Column | Data Type | Constraints & Notes |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `UUID` | Primary Key (`uuid_generate_v4()`) |
| N/A | `account_id` | `UUID` | Foreign Key `public.accounts(id)` ON DELETE CASCADE |
| `vehicleId` | `vehicle_id` | `UUID` | Foreign Key `public.vehicles(id)` ON DELETE CASCADE |
| `serviceDate` | `service_date` | `DATE` | Service date |
| `odometer` | `odometer` | `INT` | Odometer reading at service |
| `serviceType` | `service_type` | `TEXT` | `CHECK (service_type IN ('General Service', 'Oil Change', 'Tyre Replacement', 'Battery', 'Repair', 'Other'))` |
| `garageName` | `garage_name` | `TEXT` | Garage / Service center |
| `description` | `description` | `TEXT` | Detailed work description |
| `amount` | `amount` | `NUMERIC(10, 2)` | Total invoice cost |
| `nextServiceDate` | `next_service_date` | `DATE` | Next due service date |
| `notes` | `notes` | `TEXT` | Mechanic notes |
| `createdAt` | `created_at` | `TIMESTAMPTZ` | Timestamp created |

---

## 5. 💰 Expense Tracking Mapping

### Frontend Interface: `Expense` (`types/index.ts`)
### Database Table: `public.expenses`

| Frontend TypeScript Field | PostgreSQL Column | Data Type | Constraints & Notes |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `UUID` | Primary Key (`uuid_generate_v4()`) |
| N/A | `account_id` | `UUID` | Foreign Key `public.accounts(id)` ON DELETE CASCADE |
| `vehicleId` | `vehicle_id` | `UUID` | Foreign Key `public.vehicles(id)` ON DELETE CASCADE |
| N/A | `service_id` | `UUID` | Foreign Key `public.services(id)` ON DELETE CASCADE (Auto-linked service cost) |
| `category` | `category` | `TEXT` | `CHECK (category IN ('Fuel', 'Service & Maintenance', 'Insurance', 'PUC', 'Road Tax', 'Repairs', 'Accessories', 'Other'))` |
| `amount` | `amount` | `NUMERIC(10, 2)` | Transaction amount |
| `date` | `date` | `DATE` | Transaction date |
| `paymentMethod` | `payment_method` | `TEXT` | `CHECK (payment_method IN ('UPI', 'Credit Card', 'Debit Card', 'Cash', 'Net Banking'))` |
| `description` | `description` | `TEXT` | Description |
| `notes` | `notes` | `TEXT` | Optional notes |
| `createdAt` | `created_at` | `TIMESTAMPTZ` | Timestamp created |

---

## 6. ⏰ Reminders Mapping

### Frontend Interface: `Reminder` (`types/index.ts`)
### Database Table: `public.reminders`

| Frontend TypeScript Field | PostgreSQL Column | Data Type | Constraints & Notes |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `UUID` | Primary Key (`uuid_generate_v4()`) |
| N/A | `account_id` | `UUID` | Foreign Key `public.accounts(id)` ON DELETE CASCADE |
| `vehicleId` | `vehicle_id` | `UUID` | Foreign Key `public.vehicles(id)` ON DELETE CASCADE |
| `title` | `title` | `TEXT` | Reminder title |
| `category` | `category` | `TEXT` | `CHECK (category IN ('Insurance renewal', 'PUC renewal', 'Road tax', 'Vehicle servicing', 'Fitness certificate', 'Custom'))` |
| `dueDate` | `due_date` | `DATE` | Due date |
| `priority` | `priority` | `TEXT` | `CHECK (priority IN ('Low', 'Medium', 'High'))` |
| `completed` | `completed` | `BOOLEAN` | Completion status flag |
| `notes` | `notes` | `TEXT` | Additional notes |
| `createdAt` | `created_at` | `TIMESTAMPTZ` | Timestamp created |
