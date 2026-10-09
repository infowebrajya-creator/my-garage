import {
  Vehicle,
  DocumentRecord,
  ServiceRecord,
  Expense,
  Reminder,
  UserSettings,
} from '@/types';

/**
 * Interface definition for the Garage Repository.
 * All operations return Promises to ensure seamless swapping between LocalStorage (current)
 * and Supabase Client / Database REST APIs (future backend migration).
 */
export interface IGarageRepository {
  // Vehicles
  getVehicles(): Promise<Vehicle[]>;
  saveVehicles(vehicles: Vehicle[]): Promise<void>;

  // Documents
  getDocuments(): Promise<DocumentRecord[]>;
  saveDocuments(docs: DocumentRecord[]): Promise<void>;

  // Service History
  getServices(): Promise<ServiceRecord[]>;
  saveServices(services: ServiceRecord[]): Promise<void>;

  // Expenses
  getExpenses(): Promise<Expense[]>;
  saveExpenses(expenses: Expense[]): Promise<void>;

  // Reminders
  getReminders(): Promise<Reminder[]>;
  saveReminders(reminders: Reminder[]): Promise<void>;

  // User Settings
  getSettings(): Promise<UserSettings>;
  saveSettings(settings: UserSettings): Promise<void>;

  // Storage Reset / Cleanup
  resetData(): Promise<void>;
}
