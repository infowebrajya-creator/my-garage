export type VehicleType = 'Car' | 'Bike' | 'Scooter' | 'Truck' | 'Bus' | 'Other';
export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'CNG' | 'Hybrid';

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  brand: string;
  model: string;
  registrationNumber: string;
  fuelType: FuelType;
  year: number;
  purchaseDate: string;
  odometer: number;
  chassisNumber?: string;
  engineNumber?: string;
  isParivahanVerified?: boolean;
  parivahanRto?: string;
  notes?: string;
  imageUrl?: string;
  createdAt: string;
}

export type DocumentType = 
  | 'RC' 
  | 'Insurance' 
  | 'PUC' 
  | 'Driving Licence' 
  | 'Road Tax' 
  | 'Fitness Certificate' 
  | 'Other';

export type ExpiryStatus = 'valid' | 'expiring_soon' | 'expired';

export interface DocumentRecord {
  id: string;
  vehicleId: string;
  type: DocumentType;
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  fileName?: string;
  notes?: string;
  createdAt: string;
}

export type ServiceType = 
  | 'General Service' 
  | 'Oil Change' 
  | 'Tyre Replacement' 
  | 'Battery' 
  | 'Repair' 
  | 'Other';

export interface ServiceRecord {
  id: string;
  vehicleId: string;
  serviceDate: string;
  odometer: number;
  serviceType: ServiceType;
  garageName: string;
  description: string;
  amount: number;
  nextServiceDate?: string;
  notes?: string;
  createdAt: string;
}

export type ExpenseCategory = 
  | 'Fuel' 
  | 'Service & Maintenance' 
  | 'Insurance' 
  | 'PUC' 
  | 'Road Tax' 
  | 'Repairs' 
  | 'Accessories' 
  | 'Other';

export type PaymentMethod = 'UPI' | 'Credit Card' | 'Debit Card' | 'Cash' | 'Net Banking';

export interface Expense {
  id: string;
  vehicleId: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  description: string;
  notes?: string;
  createdAt: string;
}

export type ReminderCategory = 
  | 'Insurance renewal' 
  | 'PUC renewal' 
  | 'Road tax' 
  | 'Vehicle servicing' 
  | 'Fitness certificate' 
  | 'Custom';

export type Priority = 'Low' | 'Medium' | 'High';

export interface Reminder {
  id: string;
  vehicleId: string;
  title: string;
  category: ReminderCategory;
  dueDate: string;
  priority: Priority;
  completed: boolean;
  notes?: string;
  createdAt: string;
}

export interface UserSettings {
  name: string;
  email: string;
  phone: string;
  currency: string;
  dateFormat: string;
  notifications: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  whatsappProvider?: 'cloud_api' | 'twilio' | 'ultramsg' | 'qr_direct';
  whatsappApiKey?: string;
  autoSendDutyNotification?: boolean;
  dutyMessageTemplate?: string;
  sandboxApiKey?: string;
  avatarUrl?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  assignedVehicleId?: string;
  assignedVehicleName?: string;
  status: 'Active' | 'On Trip' | 'Unassigned' | 'On Leave';
  experience: string;
  createdAt: string;
}

export type TripStatus = 'In Progress' | 'Completed' | 'Scheduled';

export interface TripRecord {
  id: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  vehicleName: string;
  registrationNumber: string;
  startOdometer: number;
  endOdometer?: number | null;
  distanceTraveled?: number | null;
  purpose: string;
  startLocation: string;
  destination: string;
  startTime: string;
  endTime?: string | null;
  status: TripStatus;
  notes?: string;
  createdAt: string;
}

export interface ChallanRecord {
  id: string;
  vehicleId?: string;
  vehicleName: string;
  registrationNumber?: string;
  challanNo: string;
  offense: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'Pending' | 'Paid';
  location: string;
  createdAt: string;
}
