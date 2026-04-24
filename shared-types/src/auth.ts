import type { MoneyPocket, UserProfile } from './domain';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

export interface AuthSessionResponse extends AuthTokens {
  user: UserProfile;
}

export interface LoginRequest {
  email: string;
  password: string;
  deviceName: string;
}

export interface RegisterRequest extends LoginRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface QuickCommandParsedResult {
  merchantName: string;
  amountMinor: number;
  currencyCode: 'AMD';
  category: string;
  source: 'typed' | 'voice';
  direction: 'debit';
  confidence: number;
  pocket?: MoneyPocket;
}
