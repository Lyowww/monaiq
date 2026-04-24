import type { AppLanguage } from '../../locales/i18n.types';

const MS_DAY = 86_400_000;

export function formatActivityTime(date: Date, appLanguage: AppLanguage): string {
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startD = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = (startToday.getTime() - startD.getTime()) / MS_DAY;
  const timeStr = date.toLocaleTimeString(appLanguage === 'hy' ? 'hy-AM' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  if (diff === 0) {
    if (appLanguage === 'hy') {
      return `Այսօր, ${timeStr}`;
    }
    return `Today, ${timeStr}`;
  }
  if (diff === 1) {
    if (appLanguage === 'hy') {
      return `Երեկ, ${timeStr}`;
    }
    return `Yesterday, ${timeStr}`;
  }
  return date.toLocaleString(appLanguage === 'hy' ? 'hy-AM' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
