import { 
  Vehicle, 
  DocumentRecord, 
  ServiceRecord, 
  Expense, 
  Reminder, 
  UserSettings,
  Driver,
  TripRecord,
  ChallanRecord
} from '@/types';
import { garageRepository } from './repository';
import { 
  INITIAL_VEHICLES,
  INITIAL_DOCUMENTS, 
  INITIAL_SERVICES, 
  INITIAL_EXPENSES, 
  INITIAL_REMINDERS, 
  INITIAL_DRIVERS, 
  INITIAL_TRIPS, 
  INITIAL_CHALLANS,
  INITIAL_USER_SETTINGS
} from './mock-data';

const getStoredData = <T>(key: string, initialData: T[]): T[] => {
  if (typeof window === 'undefined') return initialData;
  try {
    const item = localStorage.getItem(key);
    if (!item) return initialData;
    const parsed = JSON.parse(item);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return initialData;
  } catch {
    return initialData;
  }
};

/**
 * StorageService wrapper maintaining synchronous backwards compatibility
 * while delegating storage management to garageRepository.
 */
export const StorageService = {
  getVehicles: (): Vehicle[] => getStoredData('nandan_vehicles_v1', INITIAL_VEHICLES),
  saveVehicles: (vehicles: Vehicle[]): void => {
    if (typeof window !== 'undefined') localStorage.setItem('nandan_vehicles_v1', JSON.stringify(vehicles));
    garageRepository.saveVehicles(vehicles);
  },

  getDocuments: (): DocumentRecord[] => getStoredData('nandan_documents_v1', INITIAL_DOCUMENTS),
  saveDocuments: (docs: DocumentRecord[]): void => {
    if (typeof window !== 'undefined') localStorage.setItem('nandan_documents_v1', JSON.stringify(docs));
    garageRepository.saveDocuments(docs);
  },

  getServices: (): ServiceRecord[] => getStoredData('nandan_services_v1', INITIAL_SERVICES),
  saveServices: (services: ServiceRecord[]): void => {
    if (typeof window !== 'undefined') localStorage.setItem('nandan_services_v1', JSON.stringify(services));
    garageRepository.saveServices(services);
  },

  getExpenses: (): Expense[] => getStoredData('nandan_expenses_v1', INITIAL_EXPENSES),
  saveExpenses: (expenses: Expense[]): void => {
    if (typeof window !== 'undefined') localStorage.setItem('nandan_expenses_v1', JSON.stringify(expenses));
    garageRepository.saveExpenses(expenses);
  },

  getReminders: (): Reminder[] => getStoredData('nandan_reminders_v1', INITIAL_REMINDERS),
  saveReminders: (reminders: Reminder[]): void => {
    if (typeof window !== 'undefined') localStorage.setItem('nandan_reminders_v1', JSON.stringify(reminders));
    garageRepository.saveReminders(reminders);
  },

  getSettings: (): UserSettings => {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem('nandan_settings_v1');
        if (item) return JSON.parse(item);
      } catch {
        // Fallthrough
      }
    }
    return INITIAL_USER_SETTINGS;
  },
  saveSettings: (settings: UserSettings): void => {
    if (typeof window !== 'undefined') localStorage.setItem('nandan_settings_v1', JSON.stringify(settings));
    garageRepository.saveSettings(settings);
  },

  getDrivers: (): Driver[] => getStoredData('nandan_drivers_v1', INITIAL_DRIVERS),
  saveDrivers: (drivers: Driver[]): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nandan_drivers_v1', JSON.stringify(drivers));
    }
  },

  getTrips: (): TripRecord[] => getStoredData('nandan_trips_v1', INITIAL_TRIPS),
  saveTrips: (trips: TripRecord[]): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nandan_trips_v1', JSON.stringify(trips));
    }
  },

  getChallans: (): ChallanRecord[] => getStoredData('nandan_challans_v1', INITIAL_CHALLANS),
  saveChallans: (challans: ChallanRecord[]): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nandan_challans_v1', JSON.stringify(challans));
    }
  },

  resetAll: (): void => {
    garageRepository.resetData();
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('nandan_vehicles_v1');
        localStorage.removeItem('nandan_documents_v1');
        localStorage.removeItem('nandan_services_v1');
        localStorage.removeItem('nandan_expenses_v1');
        localStorage.removeItem('nandan_reminders_v1');
        localStorage.removeItem('nandan_drivers_v1');
        localStorage.removeItem('nandan_trips_v1');
        localStorage.removeItem('nandan_challans_v1');
        localStorage.removeItem('nandan_settings_v1');
      } catch {
        // Safe fail
      }
    }
  }
};
