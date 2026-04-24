export type CurrencyCode = 'AMD' | 'USD' | 'EUR';

/** Where money lives for this entry — used to split card vs cash on hand. */
export type MoneyPocket = 'cash' | 'card';

export type TransactionDirection = 'credit' | 'debit';
export type TransactionSource = 'manual' | 'ocr' | 'voice' | 'bank_sync' | 'suggestion';
export type ExpenseSource = 'manual' | 'ocr' | 'suggestion';
export type IncomeSource = 'salary' | 'freelance' | 'gift' | 'other';
export type DebtRelationship = 'family' | 'friend' | 'bank' | 'fintech' | 'other';
export type DebtStatus = 'active' | 'settled' | 'defaulted';
export type DebtType = 'I_OWE' | 'THEY_OWE';
export type NoteStatus = 'scheduled' | 'done' | 'cancelled';
export type SubscriptionTier = 'free' | 'premium';

export interface UserSettings {
  lowBalanceThresholdMinor: number;
  /** Notify before upcoming payments and debts */
  notificationPayments: boolean;
  notificationDebts: boolean;
  notificationLowBalance: boolean;
  notificationUnusualSpending: boolean;
  subscription: SubscriptionTier;
  /**
   * Active commercial plan slug from admin-configured plans.
   * `null` / omitted = free tier (base features only unless legacy `subscription: premium`).
   */
  subscriptionPlanKey?: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  currencyCode: CurrencyCode;
  locale: string;
  dateOfBirth: string;
  isEmailVerified: boolean;
  /** Server-side; also encoded in access JWT for protected admin routes */
  isAdmin?: boolean;
  /** Present when returned from /users/me */
  settings?: UserSettings;
  /**
   * Server-computed feature ids the account may use (mobile paywall gating).
   * Present on `GET /users/me`.
   */
  entitledFeatureIds?: string[];
}

export interface TransactionRecord {
  id: string;
  userId: string;
  debtId?: string;
  obligationId?: string;
  scheduledPaymentId?: string;
  source: TransactionSource;
  category: string;
  subcategory?: string;
  direction: TransactionDirection;
  amountMinor: number;
  currencyCode: CurrencyCode;
  bookedAt: string;
  merchantName?: string;
  notes?: string;
  isTransfer: boolean;
  /** When direction is credit */
  incomeSource?: IncomeSource;
  /** Recurring income metadata (when set) */
  recurring?: boolean;
  recurrenceType?: 'monthly' | 'weekly' | 'none';
  /** Omitted in older rows — treated as card when aggregating. */
  pocket?: MoneyPocket;
}

export interface DebtRecord {
  id: string;
  userId: string;
  lenderName: string;
  /** Preferred display name (counterparty) */
  personName: string;
  debtType: DebtType;
  principalMinor: number;
  outstandingMinor: number;
  minimumDueMinor: number;
  aprPercent: number;
  dueDate: string;
  relationship: DebtRelationship;
  status: DebtStatus;
  reason?: string;
  reminderEnabled: boolean;
}

export interface NoteRecord {
  id: string;
  userId: string;
  title: string;
  body?: string;
  dueDate: string;
  totalObligationMinor: number;
  projectedBalanceMinor: number;
  status: NoteStatus;
  aiWarningTriggered: boolean;
}

export interface AiWarning {
  noteId: string;
  title: string;
  dueDate: string;
  projectedBalanceMinor: number;
  totalObligationMinor: number;
  severity: 'medium' | 'high' | 'critical';
  message: string;
}

export type PaymentCategory = 'utilities' | 'subscription' | 'rent' | 'other';
export type PaymentStatus = 'pending' | 'paid';
export type RecurrenceType = 'none' | 'weekly' | 'monthly';

export interface ScheduledPaymentRecord {
  id: string;
  userId: string;
  title: string;
  description?: string;
  amountMinor: number;
  dueDate: string;
  recurring: boolean;
  recurrenceType: RecurrenceType;
  category: PaymentCategory;
  status: PaymentStatus;
  reminderEnabled: boolean;
}

export type AppNotificationType =
  | 'payment_due'
  | 'debt_due'
  | 'low_balance'
  | 'unusual_spending'
  | 'insight'
  | 'general';

export interface AppNotificationRecord {
  id: string;
  userId: string;
  type: AppNotificationType;
  title: string;
  message: string;
  scheduledAt: string;
  isRead: boolean;
}

export type AutoInsightSeverity = 'info' | 'warning' | 'critical';

export interface AutoInsight {
  id: string;
  type: string;
  title: string;
  message: string;
  severity: AutoInsightSeverity;
}

export interface SmartSuggestion {
  recentMerchants: { merchant: string; count: number; lastAt: string }[];
  topCategories: { category: string; amountMinor: number }[];
}

/** User-defined plan the assistant should respect when giving advice. */
export interface FinancePlanRecord {
  id: string;
  title: string;
  planType: 'monthly_spend_cap' | 'category_spend_cap' | 'savings_target';
  /** Max total debit spending per calendar month (same minor units as transactions). */
  capMinor?: number;
  /** When planType is category_spend_cap. */
  category?: string;
  /** savings_target: goal amount in minor units. */
  targetMinor?: number;
  savedMinor?: number;
  notes?: string;
}

/**
 * Data passed to the finance LLM. Field names are explicit so the model does not
 * double-count (e.g. do not add 30‑day inflow to net balance).
 */
export interface FinanceAssistantContext {
  /** ISO-8601 UTC when this snapshot was built. */
  generatedAtUtc: string;
  currencyCode: CurrencyCode;
  /**
   * How stored integers relate to what the user sees in the UI.
   * In this app, AMD (and other fiat) amounts are stored as **hundredths** of the main unit
   * (e.g. 100 minor = 1 dram); always divide `*Minor` fields by `minorUnitsPerMajor`.
   */
  amountUnit:
    | 'hundred_minor_units_equal_one_major_AMD_dram'
    | 'hundred_minor_units_equal_one_major_USD_EUR'
    | 'one_minor_unit_equals_one_unit_unspecified';

  /**
   * Divide every `*Minor` field by this number to match formatted amounts on the home screen
   * (AMD: 100 minor → 1 dram shown).
   */
  minorUnitsPerMajor: number;

  /**
   * `netBalanceAllTransactionsMinor / minorUnitsPerMajor` — same order of magnitude as the
   * dashboard “Total balance” label (not additional money on top of the net minor figure).
   */
  totalBalanceMajorUnits: number;

  /**
   * Net by pocket (card vs cash), same rules as the dashboard wallet strip.
   * Stored in minor units; divide by `minorUnitsPerMajor` for display.
   */
  pocketNetMinor: { card: number; cash: number };

  /** Active spending / savings plans the user asked the assistant to honor. */
  activeFinancialPlans: FinancePlanRecord[];

  /**
   * Single source of truth for “how much the user has in the app”:
   * sum(credit amountMinor) − sum(debit amountMinor) across **all** recorded transactions.
   * Do not re-derive a different “balance” by summing the `recentTransactions` list
   * (that list is an incomplete sample).
   */
  netBalanceAllTransactionsMinor: number;

  /**
   * Rolling last 30 full days in server UTC — **not** a calendar month.
   * These are **not** added on top of `netBalanceAllTransactionsMinor`.
   */
  last30Days: {
    totalCreditsMinor: number;
    totalDebitsMinor: number;
    /** credits − debits in this window only. This is *cashflow in the period*, not your account total. */
    netCashflowInWindowMinor: number;
  };

  /**
   * Same window as `last30Days`, debit-only split; `unspecified` means no `pocket` on the row
   * (analytics default = card in the app).
   */
  last30DaysDebitByPocket: Array<{
    pocket: 'cash' | 'card' | 'unspecified_defaults_to_card_in_app';
    amountMinor: number;
  }>;

  /** Most recent rows (up to 25) for category / merchant context — not an exhaustive sum. */
  recentTransactions: TransactionRecord[];
  debts: DebtRecord[];
  upcomingScheduledPayments: ScheduledPaymentRecord[];
  /** Debit totals by category, same 30-day rolling window as `last30Days`. */
  spendingByCategoryLast30Days: { category: string; amountMinor: number }[];
  unusualSpendingFlags: string[];
}
