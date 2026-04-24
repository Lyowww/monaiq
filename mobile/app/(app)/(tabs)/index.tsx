import { useMemo } from 'react';
import type { QuickCommandParsedResult } from '@ai-finance/shared-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { View } from 'react-native';
import { DashboardSkeleton } from '../../../src/components/dashboard/DashboardSkeleton';
import { SmartDashboard } from '../../../src/components/dashboard/SmartDashboard';
import { useAuthStore } from '../../../src/features/auth/store/useAuthStore';
import { useDashboardSummaryQuery } from '../../../src/features/dashboard/hooks/useDashboardQuery';
import { transactionsApi } from '../../../src/features/transactions/api/transactionsApi';

type QuickCreatePayload = {
  parsed: QuickCommandParsedResult;
  rawCommand: string;
};

export default function HomeTab() {
  const queryClient = useQueryClient();
  const session = useAuthStore((state) => state.session);
  const dashboardQuery = useDashboardSummaryQuery();

  const createQuickTransactionMutation = useMutation({
    mutationFn: (payload: QuickCreatePayload) =>
      transactionsApi.createQuickExpense({ ...payload.parsed, quickCommandRaw: payload.rawCommand }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['dashboard', 'summary'] });
      await queryClient.invalidateQueries({ queryKey: ['transactions', 'list'] });
    }
  });

  const transactions = useMemo(
    () => dashboardQuery.data?.recentTransactions ?? [],
    [dashboardQuery.data]
  );

  if (dashboardQuery.isPending && !dashboardQuery.data) {
    return (
      <View style={{ flex: 1 }}>
        <DashboardSkeleton />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SmartDashboard
        balanceMinor={dashboardQuery.data?.liquidBalanceMinor ?? 0}
        cardBalanceMinor={dashboardQuery.data?.cardBalanceMinor ?? 0}
        cashOnHandMinor={dashboardQuery.data?.cashOnHandMinor ?? 0}
        firstName={session?.user.firstName || 'Jonathan'}
        isSubmittingQuick={createQuickTransactionMutation.isPending}
        monthlyInflowMinor={dashboardQuery.data?.monthlyInflowMinor ?? 0}
        monthlyOutflowMinor={dashboardQuery.data?.monthlyOutflowMinor ?? 0}
        onQuickCreate={async (payload) => {
          await createQuickTransactionMutation.mutateAsync(payload);
        }}
        transactions={transactions}
      />
    </View>
  );
}
