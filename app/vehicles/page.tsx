import { AppLayout } from '@/components/layout/AppLayout';
import { VehicleList } from '@/components/vehicles/VehicleList';

export default function VehiclesPage() {
  return (
    <AppLayout>
      <VehicleList />
    </AppLayout>
  );
}
