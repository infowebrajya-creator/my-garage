import { ExpiryStatus } from '@/types';

export function parseValidDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  // Fix double zero month formatting like "2038-002-15" -> "2038-02-15"
  const cleaned = String(dateStr).trim().replace(/-0+0(\d)-/, '-0$1-').replace(/-0+(\d{2})-/, '-$1-');
  const d = new Date(cleaned);
  if (isNaN(d.getTime())) {
    const raw = new Date(dateStr);
    return isNaN(raw.getTime()) ? null : raw;
  }
  return d;
}

export function getDaysRemaining(expiryDateStr: string): number {
  const expiry = parseValidDate(expiryDateStr);
  if (!expiry) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return isNaN(diffDays) ? 0 : diffDays;
}

export function getExpiryStatus(expiryDateStr: string): ExpiryStatus {
  const days = getDaysRemaining(expiryDateStr);
  if (days < 0) return 'expired';
  if (days <= 30) return 'expiring_soon';
  return 'valid';
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  if (currency === 'INR' || currency === '₹') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string, format: string = 'DD/MM/YYYY'): string {
  const date = parseValidDate(dateString);
  if (!date) return dateString || '';

  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const monthName = MONTH_NAMES[date.getMonth()];

  if (format === 'MM/DD/YYYY') {
    return `${month}/${day}/${year}`;
  } else if (format === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`;
  } else if (format === 'DD MMM YYYY') {
    return `${day} ${monthName} ${year}`;
  }
  return `${day}/${month}/${year}`;
}

export function exportToCSV<T extends Record<string, unknown>>(
  filename: string,
  rows: T[],
  headers?: { key: keyof T; label: string }[]
) {
  if (!rows || !rows.length) return;

  let csvContent = '';

  if (headers && headers.length > 0) {
    csvContent += headers.map((h) => `"${h.label}"`).join(',') + '\r\n';
    rows.forEach((row) => {
      const line = headers
        .map((h) => {
          const val = row[h.key];
          return `"${val !== undefined && val !== null ? String(val).replace(/"/g, '""') : ''}"`;
        })
        .join(',');
      csvContent += line + '\r\n';
    });
  } else {
    const keys = Object.keys(rows[0]) as (keyof T)[];
    csvContent += keys.map((k) => `"${String(k)}"`).join(',') + '\r\n';
    rows.forEach((row) => {
      const line = keys
        .map((k) => {
          const val = row[k];
          return `"${val !== undefined && val !== null ? String(val).replace(/"/g, '""') : ''}"`;
        })
        .join(',');
      csvContent += line + '\r\n';
    });
  }

  // Prepend UTF-8 BOM (\uFEFF) for Excel compatibility
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const VEHICLE_IMAGE_MAP: Record<string, string> = {
  thar: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
  bmw: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
  himalayan: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
  scooter: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
  defaultCar: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80',
  defaultBike: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80'
};
