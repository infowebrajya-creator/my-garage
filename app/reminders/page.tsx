import { AppLayout } from '@/components/layout/AppLayout';
import { ReminderManager } from '@/components/reminders/ReminderManager';

export default function RemindersPage() {
  return (
    <AppLayout>
      <ReminderManager />
    </AppLayout>
  );
}
