export * from './types';
export * from './localStorageRepository';

/**
 * ARCHITECTURE INTEGRATION GUIDE FOR SUPABASE:
 * 
 * To connect Supabase in Stage 2:
 * 1. Create `lib/repository/supabaseRepository.ts` implementing `IGarageRepository`.
 * 2. Implement async calls to `supabase.from('vehicles').select()`, etc., using Row Level Security (RLS).
 * 3. Export `supabaseRepository` as `garageRepository` in this file.
 * 
 * Zero changes will be required in React components or UI pages!
 */
