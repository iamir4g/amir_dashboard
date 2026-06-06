export const formatDateOnly = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const toTimeHHmm = (value?: string): string => {
  if (!value) return '';
  const tIndex = value.indexOf('T');
  if (tIndex === -1) return '';
  return value.slice(tIndex + 1, tIndex + 6);
};

export const formatPersianDateLong = (value?: string): string => {
  if (!value) return '---';
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return '---';
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};
