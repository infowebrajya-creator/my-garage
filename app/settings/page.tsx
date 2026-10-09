import { AppLayout } from '@/components/layout/AppLayout';
import { UserSettingsView } from '@/components/settings/UserSettingsView';

export default function SettingsPage() {
  return (
    <AppLayout>
      <UserSettingsView />
    </AppLayout>
  );
}
