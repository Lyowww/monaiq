import type { TransactionRecord } from '@ai-finance/shared-types';

export type AnalyticsPeriod = 7 | 30 | 90;

export function startOfLocalDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/**
 * For each of the last `days` local days, sums credits and debits (skips internal transfers if flagged).
 */
export function dailyCreditDebitSeries(
  transactions: TransactionRecord[],
  days: number
): { credits: number[]; debits: number[]; labels: string[] } {
  const totalsC = Array.from({ length: days }, () => 0);
  const totalsD = Array.from({ length: days }, () => 0);
  const labels: string[] = [];
  const now = new Date();
  const end = startOfLocalDay(now);
  const start = new Date(end);
  start.setDate(start.getDate() - (days - 1));

  for (let i = 0; i < days; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    labels.push(`${day.getMonth() + 1}/${day.getDate()}`);
  }

  const startMs = start.getTime();
  const dayMs = 86_400_000;

  for (const t of transactions) {
    if (t.isTransfer) {
      continue;
    }
    const b = new Date(t.bookedAt);
    if (b < start || b > now) {
      continue;
    }
    const bDay = startOfLocalDay(b);
    const dayIndex = Math.floor((bDay.getTime() - startMs) / dayMs);
    if (dayIndex < 0 || dayIndex >= days) {
      continue;
    }
    if (t.direction === 'credit') {
      totalsC[dayIndex] = (totalsC[dayIndex] ?? 0) + t.amountMinor;
    } else {
      totalsD[dayIndex] = (totalsD[dayIndex] ?? 0) + t.amountMinor;
    }
  }

  return { credits: totalsC, debits: totalsD, labels };
}

export function sumSeries(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

export function topDebitCategoryInPeriod(
  transactions: TransactionRecord[],
  days: number
): { category: string; amountMinor: number } | null {
  const now = new Date();
  const end = startOfLocalDay(now);
  const start = new Date(end);
  start.setDate(start.getDate() - (days - 1));

  const by: Record<string, number> = {};
  for (const t of transactions) {
    if (t.direction !== 'debit' || t.isTransfer) {
      continue;
    }
    const b = new Date(t.bookedAt);
    if (b < start || b > now) {
      continue;
    }
    const c = t.category || 'general';
    by[c] = (by[c] ?? 0) + t.amountMinor;
  }
  const entries = Object.entries(by);
  if (entries.length === 0) {
    return null;
  }
  entries.sort((a, b) => b[1] - a[1]);
  const top = entries[0];
  if (!top) {
    return null;
  }
  return { category: top[0], amountMinor: top[1] };
}
