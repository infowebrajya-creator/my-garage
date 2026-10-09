import {
  Vehicle,
  DocumentRecord,
  ServiceRecord,
  Expense,
  Reminder,
  UserSettings,
} from '@/types';
import { IGarageRepository } from './types';
import {
  INITIAL_VEHICLES,
  INITIAL_DOCUMENTS,
  INITIAL_SERVICES,
  INITIAL_EXPENSES,
  INITIAL_REMINDERS,
  INITIAL_USER_SETTINGS,
} from '../mock-data';

const STORAGE_KEYS = {
  VEHICLES: 'nandan_vehicles_v1',
  DOCUMENTS: 'nandan_documents_v1',
  SERVICES: 'nandan_services_v1',
  EXPENSES: 'nandan_expenses_v1',
  REMINDERS: 'nandan_reminders_v1',
  SETTINGS: 'nandan_settings_v1',
};

/**
 * LocalStorage Implementation of IGarageRepository.
 * Handles storage reads, writes, JSON error recovery, and safe defaults.
 */
export class LocalStorageRepository implements IGarageRepository {
  private getItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      const parsed = JSON.parse(item);
      if (Array.isArray(parsed) && parsed.length === 0 && Array.isArray(defaultValue) && defaultValue.length > 0) {
        return defaultValue;
      }
      return parsed ?? defaultValue;
    } catch (error) {
      console.error(`[MyGarage Storage Error] Failed to read ${key} from localStorage:`, error);
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`[MyGarage Storage Error] Failed to write ${key} to localStorage:`, error);
    }
  }

  async getVehicles(): Promise<Vehicle[]> {
    return this.getItem<Vehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
  }

  async saveVehicles(vehicles: Vehicle[]): Promise<void> {
    this.setItem(STORAGE_KEYS.VEHICLES, vehicles);
  }

  async getDocuments(): Promise<DocumentRecord[]> {
    return this.getItem<DocumentRecord[]>(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
  }

  async saveDocuments(docs: DocumentRecord[]): Promise<void> {
    this.setItem(STORAGE_KEYS.DOCUMENTS, docs);
  }

  async getServices(): Promise<ServiceRecord[]> {
    return this.getItem<ServiceRecord[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  }

  async saveServices(services: ServiceRecord[]): Promise<void> {
    this.setItem(STORAGE_KEYS.SERVICES, services);
  }

  async getExpenses(): Promise<Expense[]> {
    return this.getItem<Expense[]>(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
  }

  async saveExpenses(expenses: Expense[]): Promise<void> {
    this.setItem(STORAGE_KEYS.EXPENSES, expenses);
  }

  async getReminders(): Promise<Reminder[]> {
    return this.getItem<Reminder[]>(STORAGE_KEYS.REMINDERS, INITIAL_REMINDERS);
  }

  async saveReminders(reminders: Reminder[]): Promise<void> {
    this.setItem(STORAGE_KEYS.REMINDERS, reminders);
  }

  async getSettings(): Promise<UserSettings> {
    return this.getItem<UserSettings>(STORAGE_KEYS.SETTINGS, INITIAL_USER_SETTINGS);
  }

  async saveSettings(settings: UserSettings): Promise<void> {
    this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  async resetData(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.error('[MyGarage Storage Error] Failed to reset localStorage:', error);
    }
  }
}

/**
 * Default Active Repository Instance.
 * When Supabase is integrated, this instance can be swapped to SupabaseRepository.
 */
export const garageRepository: IGarageRepository = new LocalStorageRepository();
