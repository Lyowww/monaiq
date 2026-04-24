import type { AppLanguage } from '../../locales/i18n.types';
import { translate } from '../../locales/i18n';
import { ApiError } from '../http/apiClient';

function trimDetail(s: string, max = 200): string {
  return s.replace(/\s+/g, ' ').trim().slice(0, max);
}

/**
 * Maps chat failures to a user message. The old UI always blamed "network" even for
 * 401, 5xx, or server validation errors — this avoids that.
 */
export function getAssistantChatErrorText(lang: AppLanguage, error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return translate(lang, 'assistant.chatErrorAuth');
    }
    if (error.status === 403) {
      return translate(lang, 'assistant.chatErrorForbidden');
    }
    if (error.status === 503) {
      const detail = trimDetail(error.message);
      if (detail.length > 0) {
        return translate(lang, 'assistant.chatErrorDetail', { message: detail });
      }
      return translate(lang, 'assistant.chatErrorServer');
    }
    if (error.status >= 500) {
      return translate(lang, 'assistant.chatErrorServer');
    }
    const detail = trimDetail(error.message);
    if (detail.length > 0) {
      return translate(lang, 'assistant.chatErrorDetail', { message: detail });
    }
    return translate(lang, 'assistant.chatErrorRequest');
  }

  if (error instanceof Error) {
    const msg = error.message ?? '';
    if (
      error.name === 'TypeError' ||
      /network request failed/i.test(msg) ||
      /failed to fetch/i.test(msg) ||
      /load failed/i.test(msg) ||
      /aborted|timeout/i.test(msg)
    ) {
      return translate(lang, 'assistant.chatErrorNetwork');
    }
  }

  return translate(lang, 'assistant.chatErrorGeneric');
}
