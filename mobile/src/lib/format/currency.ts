let cachedFormatter: Intl.NumberFormat | null = null;

function createAmdFormatter(): Intl.NumberFormat {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'AMD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  };

  const locales: Array<string | undefined> = ['hy-AM', 'en-US', undefined];

  for (const locale of locales) {
    try {
      return new Intl.NumberFormat(locale, options);
    } catch {
      continue;
    }
  }

  return {
    format(value: number): string {
      return `${Math.round(value).toLocaleString('en-US')} AMD`;
    }
  } as Intl.NumberFormat;
}

function getAmdFormatter(): Intl.NumberFormat {
  if (!cachedFormatter) {
    cachedFormatter = createAmdFormatter();
  }

  return cachedFormatter;
}

export function formatAmdFromMinor(amountMinor: number): string {
  return getAmdFormatter().format(amountMinor / 100);
}

/** Compact AMD for chart Y-axis labels (no currency word). */
export function formatAmdAxisCompact(amountMinor: number): string {
  const amd = Math.max(0, amountMinor / 100);
  if (amd >= 1_000_000) {
    return `${(amd / 1_000_000).toFixed(amd >= 10_000_000 ? 0 : 1)}M`;
  }
  if (amd >= 10_000) {
    return `${Math.round(amd / 1000)}k`;
  }
  if (amd >= 1000) {
    return `${(amd / 1000).toFixed(1)}k`;
  }
  return String(Math.round(amd));
}

export function parseAmdToMinor(amount: number): number {
  return Math.round(amount * 100);
}

export function formatPriceMinor(
  priceMinor: number,
  currencyCode: 'AMD' | 'USD' | 'EUR' | string
): string {
  const amount = priceMinor / 100;
  const code = currencyCode === 'AMD' || currencyCode === 'USD' || currencyCode === 'EUR'
    ? currencyCode
    : 'AMD';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      minimumFractionDigits: code === 'AMD' ? 0 : 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${code}`;
  }
}
