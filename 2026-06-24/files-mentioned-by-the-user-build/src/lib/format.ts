export const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins ? `${hours}h ${mins}m` : `${hours}h`;
};

export const formatHours = (minutes: number) => `${(minutes / 60).toFixed(minutes % 60 ? 1 : 0)}h`;

export const formatDate = (iso: string, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }) =>
  new Intl.DateTimeFormat('en-GB', options).format(new Date(`${iso}T12:00:00`));

export const formatMonth = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' }).format(new Date(`${iso}T12:00:00`));

export const daysBetween = (a: string, b: string) =>
  Math.round(Math.abs(new Date(`${a}T12:00:00`).getTime() - new Date(`${b}T12:00:00`).getTime()) / 86_400_000);

export const todayIso = () => new Date().toISOString().slice(0, 10);

export const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
