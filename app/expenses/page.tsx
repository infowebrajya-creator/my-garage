import { AppLayout } from '@/components/layout/AppLayout';
import { ExpenseTracker } from '@/components/expenses/ExpenseTracker';

export default function ExpensesPage() {
  return (
    <AppLayout>
      <ExpenseTracker />
    </AppLayout>
  );
}
