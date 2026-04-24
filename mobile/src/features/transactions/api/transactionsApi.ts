import type { QuickCommandParsedResult, TransactionRecord } from '@ai-finance/shared-types';
import { apiRequest } from '../../../lib/http/apiClient';

type CreateTransactionPayload = QuickCommandParsedResult & {
  quickCommandRaw: string;
};

type CreateGenericTransaction = {
  source: 'manual' | 'ocr' | 'voice' | 'bank_sync';
  category: string;
  direction: 'credit' | 'debit';
  amountMinor: number;
  currencyCode: 'AMD';
  bookedAt: string;
  merchantName?: string;
  notes?: string;
  isTransfer?: boolean;
  quickCommandRaw?: string;
  pocket?: 'cash' | 'card';
};

type AudioUploadFile = {
  uri: string;
  name: string;
  type: string;
};

async function postTransaction(payload: CreateGenericTransaction): Promise<void> {
  return apiRequest<void>('/transactions', {
    method: 'POST',
    requiresAuth: true,
    body: JSON.stringify({
      source: payload.source,
      category: payload.category,
      direction: payload.direction,
      amountMinor: payload.amountMinor,
      currencyCode: payload.currencyCode,
      bookedAt: payload.bookedAt,
      merchantName: payload.merchantName,
      notes: payload.notes,
      isTransfer: payload.isTransfer ?? false,
      quickCommandRaw: payload.quickCommandRaw,
      pocket: payload.pocket ?? 'card'
    })
  });
}

export const transactionsApi = {
  listTransactions(options?: { limit?: number; skip?: number }): Promise<TransactionRecord[]> {
    const limit = options?.limit ?? 200;
    const skip = options?.skip ?? 0;
    return apiRequest<TransactionRecord[]>(`/transactions?limit=${limit}&skip=${skip}`, {
      method: 'GET',
      requiresAuth: true
    });
  },

  createTransaction(payload: CreateGenericTransaction): Promise<void> {
    return postTransaction(payload);
  },

  createQuickExpense(payload: CreateTransactionPayload): Promise<void> {
    return postTransaction({
      source: payload.source === 'voice' ? 'voice' : 'manual',
      category: payload.category,
      direction: 'debit',
      amountMinor: payload.amountMinor,
      currencyCode: 'AMD',
      bookedAt: new Date().toISOString(),
      merchantName: payload.merchantName,
      isTransfer: false,
      quickCommandRaw: payload.quickCommandRaw,
      pocket: payload.pocket ?? 'card'
    });
  },

  async transcribeQuickCommand(audioUri: string): Promise<string> {
    const formData = new FormData();
    const audioFile: AudioUploadFile = {
      uri: audioUri,
      name: 'quick-command.m4a',
      type: 'audio/mp4'
    };

    formData.append('audio', audioFile as unknown as Blob);

    const response = await apiRequest<{ transcript: string }>('/ai/transcribe', {
      method: 'POST',
      requiresAuth: true,
      body: formData
    });

    return response.transcript;
  }
};
