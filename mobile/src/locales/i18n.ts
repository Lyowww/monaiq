import type { AppLanguage } from './i18n.types';
import en from './en.json';
import hy from './hy.json';

const bundles = { en, hy } as const;

function getValue(lang: AppLanguage, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in (acc as object)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, bundles[lang]);
}

/**
 * Interpolates `{name}` placeholders from `params`.
 */
export function translate(
  lang: AppLanguage,
  path: string,
  params?: Record<string, string | number>
): string {
  const raw = getValue(lang, path);
  if (typeof raw !== 'string') {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn(`[i18n] missing string: ${path} (${lang})`);
    }
    return path;
  }
  if (!params) {
    return raw;
  }
  return raw.replace(/\{(\w+)\}/g, (_, name: string) => {
    const v = params[name];
    return v === undefined || v === null ? `{${name}}` : String(v);
  });
}

export function translateList(lang: AppLanguage, path: string): string[] {
  const raw = getValue(lang, path);
  if (Array.isArray(raw) && raw.every((x) => typeof x === 'string')) {
    return raw as string[];
  }
  return [];
}

export { en, hy, bundles };
