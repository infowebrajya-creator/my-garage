'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import { StorageService } from '@/lib/storage';
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
} from '@/lib/mock-data';
import { useToast } from './ToastContext';

interface GarageContextType {
  vehicles: Vehicle[];
  documents: DocumentRecord[];
  services: ServiceRecord[];
  expenses: Expense[];
  reminders: Reminder[];
  drivers: Driver[];
  trips: TripRecord[];
  challans: ChallanRecord[];
  settings: UserSettings;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLoading: boolean;

  // Active modal triggers
  activeModal: 'vehicle' | 'document' | 'service' | 'expense' | 'reminder' | 'trip' | null;
  openModal: (modal: 'vehicle' | 'document' | 'service' | 'expense' | 'reminder' | 'trip', presetVehicleId?: string) => void;
  closeModal: () => void;
  modalPresetVehicleId?: string;

  // Vehicle Actions
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => void;
  updateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;

  // Driver Actions
  addDriver: (driver: Omit<Driver, 'id' | 'createdAt'>) => void;
  updateDriver: (id: string, driver: Partial<Driver>) => void;

  // Trip Sheet Actions
  startTrip: (tripData: Omit<TripRecord, 'id' | 'createdAt' | 'status' | 'startTime'>) => void;
  completeTrip: (tripId: string, endOdometer: number, notes?: string) => void;
  updateTrip: (id: string, updates: Partial<TripRecord>) => void;
  deleteTrip: (id: string) => void;

  // Challan Actions
  addChallan: (challan: Omit<ChallanRecord, 'id' | 'createdAt'>) => void;
  markChallanPaid: (challanId: string) => void;

  // Document Actions
  addDocument: (doc: Omit<DocumentRecord, 'id' | 'createdAt'>) => void;
  updateDocument: (id: string, doc: Partial<DocumentRecord>) => void;
  deleteDocument: (id: string) => void;

  // Service Actions
  addService: (service: Omit<ServiceRecord, 'id' | 'createdAt'>) => void;
  updateService: (id: string, service: Partial<ServiceRecord>) => void;
  deleteService: (id: string) => void;

  // Expense Actions
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  // Reminder Actions
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'completed'>) => void;
  updateReminder: (id: string, reminder: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  toggleReminderComplete: (id: string) => void;

  // Settings Action
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetAllData: () => void;
}

const GarageContext = createContext<GarageContextType | undefined>(undefined);

export function GarageProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trips, setTrips] = useState<TripRecord[]>([]);
  const [challans, setChallans] = useState<ChallanRecord[]>([]);
  const [settings, setSettings] = useState<UserSettings>(INITIAL_USER_SETTINGS);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [activeModal, setActiveModal] = useState<'vehicle' | 'document' | 'service' | 'expense' | 'reminder' | 'trip' | null>(null);
  const [modalPresetVehicleId, setModalPresetVehicleId] = useState<string | undefined>(undefined);

  // Initialize data on mount and listen for multi-tab changes
  useEffect(() => {
    const loadData = () => {
      try {
        const v = StorageService.getVehicles();
        const d = StorageService.getDocuments();
        const s = StorageService.getServices();
        const e = StorageService.getExpenses();
      
        const r = StorageService.getReminders();
        const drv = StorageService.getDrivers();
        const trp = StorageService.getTrips();
        const chl = StorageService.getChallans();

        // Helper to roll over active trip dates dynamically to today's live date
        const todayISODate = new Date().toISOString().split('T')[0];
        const updateActiveTripsDate = (tripsList: TripRecord[]) => {
          return tripsList.map((t) => {
            if (t.status === 'In Progress' && t.startTime) {
              const timePart = t.startTime.includes('T') ? t.startTime.split('T')[1] : '08:30:00.000Z';
              return {
                ...t,
                startTime: `${todayISODate}T${timePart}`,
                createdAt: `${todayISODate}T${timePart}`,
              };
            }
            return t;
          });
        };

        const finalV = v.length > 0 ? v : INITIAL_VEHICLES;
        const finalD = d.length > 0 ? d : INITIAL_DOCUMENTS;
        const finalS = s.length > 0 ? s : INITIAL_SERVICES;
        const finalE = e.length > 0 ? e : INITIAL_EXPENSES;
        const finalR = r.length > 0 ? r : INITIAL_REMINDERS;
        const finalDrv = drv.length > 0 ? drv : INITIAL_DRIVERS;
        const rawTrp = trp.length > 0 ? trp : INITIAL_TRIPS;
        const finalTrp = updateActiveTripsDate(rawTrp);
        const finalChl = chl.length > 0 ? chl : INITIAL_CHALLANS;

        setVehicles(finalV);
        setDocuments(finalD);
        setServices(finalS);
        setExpenses(finalE);
        setReminders(finalR);
        setDrivers(finalDrv);
        setTrips(finalTrp);
        setChallans(finalChl);
        setSettings(StorageService.getSettings());

        if (v.length === 0) StorageService.saveVehicles(finalV);
        if (d.length === 0) StorageService.saveDocuments(finalD);
        if (s.length === 0) StorageService.saveServices(finalS);
        if (e.length === 0) StorageService.saveExpenses(finalE);
        if (r.length === 0) StorageService.saveReminders(finalR);
        if (drv.length === 0) StorageService.saveDrivers(finalDrv);
        if (trp.length === 0) StorageService.saveTrips(finalTrp);
        if (chl.length === 0) StorageService.saveChallans(finalChl);
      } catch (err) {
        console.error('Failed to load storage data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key && event.key.startsWith('mygarage_')) {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const openModal = useCallback((modal: 'vehicle' | 'document' | 'service' | 'expense' | 'reminder' | 'trip', presetVehicleId?: string) => {
    setModalPresetVehicleId(presetVehicleId);
    setActiveModal(modal);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalPresetVehicleId(undefined);
  }, []);

  // --- DRIVER HANDLERS ---
  const addDriver = useCallback((data: Omit<Driver, 'id' | 'createdAt'>) => {
    const newDriver: Driver = {
      ...data,
      id: `drv-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newDriver, ...drivers];
    setDrivers(updated);
    StorageService.saveDrivers(updated);
    showToast('success', 'Driver Added', `${newDriver.name} onboarded to fleet`);
  }, [drivers, showToast]);

  const updateDriver = useCallback((id: string, updates: Partial<Driver>) => {
    const updated = drivers.map((d) => (d.id === id ? { ...d, ...updates } : d));
    setDrivers(updated);
    StorageService.saveDrivers(updated);
  }, [drivers]);

  // --- TRIP SHEET HANDLERS ---
  const startTrip = useCallback((data: Omit<TripRecord, 'id' | 'createdAt' | 'status' | 'startTime'>) => {
    const newTrip: TripRecord = {
      ...data,
      id: `trip-${Date.now()}`,
      status: 'In Progress',
      startTime: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    const updatedTrips = [newTrip, ...trips];
    setTrips(updatedTrips);
    StorageService.saveTrips(updatedTrips);

    // Update driver status to 'On Trip'
    const updatedDrivers = drivers.map((d) =>
      d.id === data.driverId ? { ...d, status: 'On Trip' as const, assignedVehicleId: data.vehicleId, assignedVehicleName: data.vehicleName } : d
    );
    setDrivers(updatedDrivers);
    StorageService.saveDrivers(updatedDrivers);

    showToast('success', 'Trip Duty Started', `Trip logger active for ${data.driverName}`);
  }, [trips, drivers, showToast]);

  const completeTrip = useCallback((tripId: string, endOdometer: number, notes?: string) => {
    const targetTrip = trips.find((t) => t.id === tripId);
    if (!targetTrip) return;

    const distance = Math.max(0, endOdometer - targetTrip.startOdometer);
    const updatedTrips = trips.map((t) =>
      t.id === tripId
        ? {
            ...t,
            endOdometer,
            distanceTraveled: distance,
            status: 'Completed' as const,
            endTime: new Date().toISOString(),
            notes: notes ? `${t.notes || ''} ${notes}`.trim() : t.notes,
          }
        : t
    );
    setTrips(updatedTrips);
    StorageService.saveTrips(updatedTrips);

    // Update vehicle's current odometer reading
    const updatedVehicles = vehicles.map((v) =>
      v.id === targetTrip.vehicleId ? { ...v, odometer: Math.max(v.odometer, endOdometer) } : v
    );
    setVehicles(updatedVehicles);
    StorageService.saveVehicles(updatedVehicles);

    // Free driver back to 'Active'
    const updatedDrivers = drivers.map((d) =>
      d.id === targetTrip.driverId ? { ...d, status: 'Active' as const } : d
    );
    setDrivers(updatedDrivers);
    StorageService.saveDrivers(updatedDrivers);

    showToast('success', 'Duty Completed', `Closed duty shift for ${targetTrip.vehicleName}`);
  }, [trips, vehicles, drivers, showToast]);

  const updateTrip = useCallback((id: string, updates: Partial<TripRecord>) => {
    const updatedTrips = trips.map((t) => (t.id === id ? { ...t, ...updates } : t));
    setTrips(updatedTrips);
    StorageService.saveTrips(updatedTrips);

    if (updates.driverId || updates.vehicleId) {
      const target = updatedTrips.find((t) => t.id === id);
      if (target) {
        const updatedDrivers = drivers.map((d) =>
          d.id === target.driverId
            ? { ...d, assignedVehicleId: target.vehicleId, assignedVehicleName: target.vehicleName }
            : d
        );
        setDrivers(updatedDrivers);
        StorageService.saveDrivers(updatedDrivers);
      }
    }

    showToast('success', 'Trip Updated', 'Trip sheet details updated successfully.');
  }, [trips, drivers, showToast]);

  const deleteTrip = useCallback((id: string) => {
    const target = trips.find((t) => t.id === id);
    const updatedTrips = trips.filter((t) => t.id !== id);
    setTrips(updatedTrips);
    StorageService.saveTrips(updatedTrips);

    if (target) {
      const updatedDrivers = drivers.map((d) =>
        d.id === target.driverId ? { ...d, status: 'Active' as const } : d
      );
      setDrivers(updatedDrivers);
      StorageService.saveDrivers(updatedDrivers);
    }

    showToast('info', 'Trip Removed', 'Trip entry deleted.');
  }, [trips, drivers, showToast]);

  // --- CHALLAN HANDLERS ---
  const addChallan = useCallback((data: Omit<ChallanRecord, 'id' | 'createdAt'>) => {
    const newChallan: ChallanRecord = {
      ...data,
      id: `chl-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newChallan, ...challans];
    setChallans(updated);
    StorageService.saveChallans(updated);
    showToast('success', 'Challan Logged', `Traffic ticket recorded for ${data.vehicleName}`);
  }, [challans, showToast]);

  const markChallanPaid = useCallback((challanId: string) => {
    const updated = challans.map((c) => (c.id === challanId ? { ...c, status: 'Paid' as const } : c));
    setChallans(updated);
    StorageService.saveChallans(updated);
    showToast('success', 'Challan Cleared', 'Traffic fine payment recorded.');
  }, [challans, showToast]);

  // --- VEHICLE HANDLERS ---
  const addVehicle = useCallback((data: Omit<Vehicle, 'id' | 'createdAt'>) => {
    const newVehicle: Vehicle = {
      ...data,
      id: `veh-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newVehicle, ...vehicles];
    setVehicles(updated);
    StorageService.saveVehicles(updated);
    showToast('success', 'Vehicle Added', `${newVehicle.name} has been added to your garage.`);
  }, [vehicles, showToast]);

  const updateVehicle = useCallback((id: string, data: Partial<Vehicle>) => {
    const updated = vehicles.map((v) => (v.id === id ? { ...v, ...data } : v));
    setVehicles(updated);
    StorageService.saveVehicles(updated);
    showToast('success', 'Vehicle Updated', 'Vehicle details updated successfully.');
  }, [vehicles, showToast]);

  const deleteVehicle = useCallback((id: string) => {
    const target = vehicles.find((v) => v.id === id);
    const updatedVehicles = vehicles.filter((v) => v.id !== id);
    
    // Cascading clean up associated records
    const updatedDocs = documents.filter((d) => d.vehicleId !== id);
    const updatedServices = services.filter((s) => s.vehicleId !== id);
    const updatedExpenses = expenses.filter((e) => e.vehicleId !== id);
    const updatedReminders = reminders.filter((r) => r.vehicleId !== id);

    setVehicles(updatedVehicles);
    setDocuments(updatedDocs);
    setServices(updatedServices);
    setExpenses(updatedExpenses);
    setReminders(updatedReminders);

    StorageService.saveVehicles(updatedVehicles);
    StorageService.saveDocuments(updatedDocs);
    StorageService.saveServices(updatedServices);
    StorageService.saveExpenses(updatedExpenses);
    StorageService.saveReminders(updatedReminders);

    showToast('info', 'Vehicle Removed', `${target?.name || 'Vehicle'} and associated records were deleted.`);
  }, [vehicles, documents, services, expenses, reminders, showToast]);

  // --- DOCUMENT HANDLERS ---
  const addDocument = useCallback((data: Omit<DocumentRecord, 'id' | 'createdAt'>) => {
    const newDoc: DocumentRecord = {
      ...data,
      id: `doc-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    StorageService.saveDocuments(updated);
    showToast('success', 'Document Uploaded', `${newDoc.type} document added to locker.`);
  }, [documents, showToast]);

  const updateDocument = useCallback((id: string, data: Partial<DocumentRecord>) => {
    const updated = documents.map((d) => (d.id === id ? { ...d, ...data } : d));
    setDocuments(updated);
    StorageService.saveDocuments(updated);
    showToast('success', 'Document Updated', 'Document details saved successfully.');
  }, [documents, showToast]);

  const deleteDocument = useCallback((id: string) => {
    const updated = documents.filter((d) => d.id !== id);
    setDocuments(updated);
    StorageService.saveDocuments(updated);
    showToast('info', 'Document Removed', 'Document has been deleted.');
  }, [documents, showToast]);

  // --- SERVICE HANDLERS ---
  const addService = useCallback((data: Omit<ServiceRecord, 'id' | 'createdAt'>) => {
    const newService: ServiceRecord = {
      ...data,
      id: `srv-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newService, ...services];
    setServices(updated);
    StorageService.saveServices(updated);

    // Auto update vehicle odometer if reading is higher
    if (data.odometer) {
      const v = vehicles.find((v) => v.id === data.vehicleId);
      if (v && data.odometer > v.odometer) {
        updateVehicle(v.id, { odometer: data.odometer });
      }
    }

    // Auto create an expense entry under Service category for cost tracking
    if (data.amount > 0) {
      const autoExpense: Expense = {
        id: `exp-auto-${newService.id}`,
        vehicleId: data.vehicleId,
        category: 'Service & Maintenance',
        amount: data.amount,
        date: data.serviceDate,
        paymentMethod: 'UPI',
        description: `${data.serviceType} - ${data.garageName}`,
        notes: data.description,
        createdAt: new Date().toISOString(),
      };
      setExpenses((prev) => {
        const nextExp = [autoExpense, ...prev];
        StorageService.saveExpenses(nextExp);
        return nextExp;
      });
    }

    showToast('success', 'Service Record Added', 'Service log saved successfully.');
  }, [services, vehicles, updateVehicle, showToast]);

  const updateService = useCallback((id: string, data: Partial<ServiceRecord>) => {
    const updated = services.map((s) => (s.id === id ? { ...s, ...data } : s));
    setServices(updated);
    StorageService.saveServices(updated);

    // Sync corresponding auto-generated expense
    setExpenses((prev) => {
      const expId = `exp-auto-${id}`;
      const nextExp = prev.map((e) => {
        if (e.id === expId) {
          return {
            ...e,
            vehicleId: data.vehicleId || e.vehicleId,
            amount: data.amount !== undefined ? data.amount : e.amount,
            date: data.serviceDate || e.date,
            description: `${data.serviceType || ''} - ${data.garageName || ''}`.trim() || e.description,
            notes: data.description || e.notes,
          };
        }
        return e;
      });
      StorageService.saveExpenses(nextExp);
      return nextExp;
    });

    showToast('success', 'Service Updated', 'Service record updated.');
  }, [services, showToast]);

  const deleteService = useCallback((id: string) => {
    const updated = services.filter((s) => s.id !== id);
    setServices(updated);
    StorageService.saveServices(updated);

    // Remove corresponding auto-generated service expense
    setExpenses((prev) => {
      const expId = `exp-auto-${id}`;
      const nextExp = prev.filter((e) => e.id !== expId);
      StorageService.saveExpenses(nextExp);
      return nextExp;
    });

    showToast('info', 'Service Log Deleted', 'Service entry removed.');
  }, [services, showToast]);

  // --- EXPENSE HANDLERS ---
  const addExpense = useCallback((data: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...data,
      id: `exp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    StorageService.saveExpenses(updated);
    showToast('success', 'Expense Logged', `Logged expense of ₹${data.amount.toLocaleString()}`);
  }, [expenses, showToast]);

  const updateExpense = useCallback((id: string, data: Partial<Expense>) => {
    const updated = expenses.map((e) => (e.id === id ? { ...e, ...data } : e));
    setExpenses(updated);
    StorageService.saveExpenses(updated);
    showToast('success', 'Expense Updated', 'Expense record saved.');
  }, [expenses, showToast]);

  const deleteExpense = useCallback((id: string) => {
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    StorageService.saveExpenses(updated);
    showToast('info', 'Expense Deleted', 'Expense entry removed.');
  }, [expenses, showToast]);

  // --- REMINDER HANDLERS ---
  const addReminder = useCallback((data: Omit<Reminder, 'id' | 'createdAt' | 'completed'>) => {
    const newReminder: Reminder = {
      ...data,
      id: `rem-${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [newReminder, ...reminders];
    setReminders(updated);
    StorageService.saveReminders(updated);
    showToast('success', 'Reminder Scheduled', `Reminder created for ${data.dueDate}`);
  }, [reminders, showToast]);

  const updateReminder = useCallback((id: string, data: Partial<Reminder>) => {
    const updated = reminders.map((r) => (r.id === id ? { ...r, ...data } : r));
    setReminders(updated);
    StorageService.saveReminders(updated);
    showToast('success', 'Reminder Saved', 'Reminder updated successfully.');
  }, [reminders, showToast]);

  const deleteReminder = useCallback((id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    StorageService.saveReminders(updated);
    showToast('info', 'Reminder Removed', 'Reminder deleted.');
  }, [reminders, showToast]);

  const toggleReminderComplete = useCallback((id: string) => {
    const updated = reminders.map((r) => {
      if (r.id === id) {
        const nextState = !r.completed;
        showToast(
          nextState ? 'success' : 'info',
          nextState ? 'Reminder Completed' : 'Reminder Reopened',
          r.title
        );
        return { ...r, completed: nextState };
      }
      return r;
    });
    setReminders(updated);
    StorageService.saveReminders(updated);
  }, [reminders, showToast]);

  // --- SETTINGS HANDLER ---
  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    StorageService.saveSettings(updated);
    showToast('success', 'Settings Saved', 'User preferences updated.');
  }, [settings, showToast]);

  const resetAllData = useCallback(() => {
    StorageService.resetAll();
    setVehicles([]);
    setDocuments([]);
    setServices([]);
    setExpenses([]);
    setReminders([]);
    setDrivers([]);
    setTrips([]);
    setChallans([]);
    setSettings(StorageService.getSettings());
    showToast('info', 'Data Cleared', 'All vehicle, driver, trip, and challan data has been cleared.');
  }, [showToast]);

  return (
    <GarageContext.Provider
      value={{
        vehicles,
        documents,
        services,
        expenses,
        reminders,
        drivers,
        trips,
        challans,
        settings,
        searchQuery,
        setSearchQuery,
        isLoading,

        activeModal,
        openModal,
        closeModal,
        modalPresetVehicleId,

        addVehicle,
        updateVehicle,
        deleteVehicle,

        addDriver,
        updateDriver,

        startTrip,
        completeTrip,
        updateTrip,
        deleteTrip,

        addChallan,
        markChallanPaid,

        addDocument,
        updateDocument,
        deleteDocument,

        addService,
        updateService,
        deleteService,

        addExpense,
        updateExpense,
        deleteExpense,

        addReminder,
        updateReminder,
        deleteReminder,
        toggleReminderComplete,

        updateSettings,
        resetAllData,
      }}
    >
      {children}
    </GarageContext.Provider>
  );
}

export function useGarage() {
  const context = useContext(GarageContext);
  if (!context) {
    throw new Error('useGarage must be used within a GarageProvider');
  }
  return context;
}
