import type { QuickCommandParsedResult } from '@ai-finance/shared-types';
import { parseAmdToMinor } from '../format/currency';

const categoryMatchers: Array<{ category: string; matcher: RegExp }> = [
  { category: 'food', matcher: /\b(kfc|burger|pizza|cafe|restaurant|shawarma|sushi)\b/i },
  { category: 'transport', matcher: /\b(taxi|yandex|metro|bus|fuel|gas)\b/i },
  { category: 'groceries', matcher: /\b(zovq|supermarket|market|sas|yerevan city|nor zovq)\b/i },
  { category: 'utilities', matcher: /\b(utility|utilities|communal|կոմունալ|electric|water|gas bill)\b/i },
  { category: 'health', matcher: /\b(pharmacy|doctor|clinic)\b/i }
];

export function parseQuickActionCommand(
  rawCommand: string,
  source: 'typed' | 'voice'
): QuickCommandParsedResult | null {
  const cleaned = rawCommand.trim().replace(/\s+/g, ' ');
  if (cleaned.length < 3) {
    return null;
  }

  const amountMatch = cleaned.match(/(\d+(?:[.,]\d{1,2})?)$/);
  if (!amountMatch) {
    return null;
  }

  const capturedAmount = amountMatch[1];
  if (!capturedAmount) {
    return null;
  }

  const amountText = capturedAmount.replace(',', '.');
  const amount = Number(amountText);
  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  const merchantName = cleaned.slice(0, cleaned.length - amountMatch[0].length).trim();
  if (merchantName.length === 0) {
    return null;
  }

  const category =
    categoryMatchers.find(({ matcher }) => matcher.test(merchantName))?.category ?? 'general';

  return {
    merchantName,
    amountMinor: parseAmdToMinor(amount),
    currencyCode: 'AMD',
    category,
    source,
    direction: 'debit',
    confidence: source === 'voice' ? 0.75 : 0.92,
    pocket: 'card'
  };
}
