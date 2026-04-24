import { apiRequest, ApiError } from '../../../lib/http/apiClient';
import type { AppLanguage } from '../../../locales/i18n.types';

export type FinanceConversationSummary = { id: string; title: string; updatedAt: string };

export type FinanceConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
  at: string;
};

export const financeChatApi = {
  async listConversations(): Promise<FinanceConversationSummary[]> {
    const data = await apiRequest<unknown>('/ai/finance/conversations', {
      method: 'GET',
      requiresAuth: true
    });
    if (!data || typeof data !== 'object' || !('conversations' in data)) {
      throw new ApiError(400, 'Unexpected conversations response.', 'ASSISTANT_CONVERSATIONS_SHAPE');
    }
    const list = (data as { conversations: unknown }).conversations;
    if (!Array.isArray(list)) {
      throw new ApiError(400, 'Unexpected conversations response.', 'ASSISTANT_CONVERSATIONS_SHAPE');
    }
    return list as FinanceConversationSummary[];
  },

  async getConversation(id: string): Promise<{
    id: string;
    title: string;
    updatedAt: string;
    messages: FinanceConversationMessage[];
  }> {
    return apiRequest(`/ai/finance/conversations/${encodeURIComponent(id)}`, {
      method: 'GET',
      requiresAuth: true
    });
  },

  async sendMessage(
    message: string,
    appLanguage: AppLanguage,
    conversationId?: string
  ): Promise<{ reply: string; conversationId: string }> {
    try {
      const body: { message: string; replyLanguage: AppLanguage; conversationId?: string } = {
        message,
        replyLanguage: appLanguage
      };
      if (conversationId) {
        body.conversationId = conversationId;
      }
      const data = await apiRequest<unknown>('/ai/finance/chat', {
        method: 'POST',
        requiresAuth: true,
        body: JSON.stringify(body),
        debugLog: 'financeChat'
      });

      if (!data || typeof data !== 'object' || !('reply' in data) || !('conversationId' in data)) {
        try {
          console.warn('[financeChat] unexpected shape (expected { reply, conversationId }):', data);
        } catch {
          /* ignore */
        }
        throw new ApiError(400, 'The assistant response was missing fields. Update the app or contact support.', 'ASSISTANT_SHAPE');
      }
      const reply = (data as { reply: unknown }).reply;
      const convId = (data as { conversationId: unknown }).conversationId;
      if (typeof reply !== 'string') {
        try {
          console.warn('[financeChat] reply was not a string:', reply);
        } catch {
          /* ignore */
        }
        throw new ApiError(400, 'The assistant response was not a text reply. Update the app or contact support.', 'ASSISTANT_REPLY_TYPE');
      }
      if (typeof convId !== 'string') {
        throw new ApiError(400, 'The assistant response was missing a conversation id.', 'ASSISTANT_CONV_ID');
      }
      return { reply, conversationId: convId };
    } catch (err) {
      if (err instanceof ApiError) {
        try {
          console.warn('[financeChat] ApiError', {
            status: err.status,
            message: err.message,
            errorCode: err.errorCode
          });
        } catch {
          /* ignore */
        }
      } else {
        try {
          console.warn('[financeChat] request threw:', err);
        } catch {
          /* ignore */
        }
      }
      throw err;
    }
  }
};
