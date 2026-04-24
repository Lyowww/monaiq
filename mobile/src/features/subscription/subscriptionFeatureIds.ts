/** Must match backend `subscription-features.catalog.ts`. */
export const SUBSCRIPTION_FEATURE = {
  AI_ASSISTANT_EXTENDED: 'ai_assistant_extended',
  ADVANCED_ANALYTICS: 'advanced_analytics',
  SMART_INSIGHTS: 'smart_insights',
  DEBT_TOOLS_PRO: 'debt_tools_pro',
  SCHEDULED_PAYMENTS_SYNC: 'scheduled_payments_sync',
  EXPORT_REPORTS: 'export_reports',
  MULTI_CURRENCY: 'multi_currency',
  CUSTOM_CATEGORIES: 'custom_categories',
  PRIORITY_SUPPORT: 'priority_support',
  EARLY_ACCESS: 'early_access'
} as const;

export type SubscriptionFeatureId =
  (typeof SUBSCRIPTION_FEATURE)[keyof typeof SUBSCRIPTION_FEATURE];
