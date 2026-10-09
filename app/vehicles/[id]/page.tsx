'use client';

import React, { use } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { VehicleDetails } from '@/components/vehicles/VehicleDetails';

interface VehicleDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const resolvedParams = use(params);

  return (
    <AppLayout>
      <VehicleDetails vehicleId={resolvedParams.id} />
    </AppLayout>
  );
}
