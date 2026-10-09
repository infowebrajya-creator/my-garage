import { AppLayout } from '@/components/layout/AppLayout';
import { DocumentLocker } from '@/components/documents/DocumentLocker';

export default function DocumentsPage() {
  return (
    <AppLayout>
      <DocumentLocker />
    </AppLayout>
  );
}
