import type {
  AiWarning,
  AutoInsight,
  CurrencyCode,
  DebtRecord,
  ScheduledPaymentRecord,
  SmartSuggestion,
  TransactionRecord
} from './domain';

export interface DashboardSummary {
  currencyCode: CurrencyCode;
  liquidBalanceMinor: number;
  /** Net inflow − outflow on card pocket (untagged history counts as card). */
  cardBalanceMinor: number;
  /** Net inflow − outflow recorded as cash. */
  cashOnHandMinor: number;
  monthlyInflowMinor: number;
  monthlyOutflowMinor: number;
  obligationDueMinor: number;
  debtPressureScore: number;
  recentTransactions: TransactionRecord[];
  aiWarnings: AiWarning[];
  lastInsightAt?: string;
  /** Upcoming bills & subscriptions, soonest first */
  upcomingPayments: ScheduledPaymentRecord[];
  recurringPayments: ScheduledPaymentRecord[];
  debtsIOwe: DebtRecord[];
  debtsTheyOweMe: DebtRecord[];
  smartSuggestions: SmartSuggestion;
  autoInsights: AutoInsight[];
}
