import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";

export type TradeLimitResponse = {
  tradeLimit: {
    id: string;
    dailyLimit: number;
    lockoutHours: number;
    isEnabled: boolean;
  } | null;
  remainingTrades: number | null;
};

export type LockoutStatus =
  | { locked: false; todayTradeCount?: number; dailyLimit?: number }
  | { locked: true; lockedUntil: string; reason: string; appsToBlock: string[] };

export type BrokerConnection = {
  id: string;
  broker: string;
  displayName: string;
  subtitle: string;
  status: "connected" | "not_connected" | "coming_soon";
  statusLabel: string;
  actionLabel: "MANAGE" | "CONNECT" | "COMING SOON";
  isEnabled: boolean;
  connectUrl: string | null;
  manageUrl: string | null;
  logoKey: string;
};

export type BrokerConnectionsResponse = {
  brokers: BrokerConnection[];
  connectedCount: number;
  updatedAt: string | null;
};

export type BrokerConnectionAction = {
  id: string;
  broker: string;
  displayName: string;
  action: "redirect" | "manage" | "unavailable";
  url: string | null;
  message: string;
};

export type JournalTrade = {
  id: string;
  symbol: string;
  side: string;
  quantity: number;
  entryPrice: number | null;
  exitPrice: number | null;
  pnl: number | null;
  status: string;
  executedAt: string;
};

export type JournalResponse = {
  trades: JournalTrade[];
};

export type JournalSummary = {
  totalTrades: number;
  closedTrades: number;
  wins: number;
  losses: number;
  totalPnl: number;
  winRate: number;
};

export function useTradeLimitQuery() {
  return useQuery({
    queryKey: ["trade-limit"],
    queryFn: async () => {
      const response = await api.get<TradeLimitResponse>("/trade-limit");
      return response.data;
    }
  });
}

export function useSaveTradeLimitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { dailyLimit: number; lockoutHours: number; isEnabled: boolean }) => {
      const response = await api.post<TradeLimitResponse>("/trade-limit", input);
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["trade-limit"] }),
        queryClient.invalidateQueries({ queryKey: ["lockout-status"] })
      ]);
    }
  });
}

export function useLockoutStatusQuery() {
  return useQuery({
    queryKey: ["lockout-status"],
    queryFn: async () => {
      const response = await api.get<LockoutStatus>("/lockout/status");
      return response.data;
    }
  });
}

export function useManualLockoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { lockoutHours: 4 | 8 | 12 | 24; reason: string }) => {
      const response = await api.post<LockoutStatus>("/lockout/manual", input);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["lockout-status"] });
    }
  });
}

export function useWeeklyLockoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { weeklyLimit: number; reason: string }) => {
      const response = await api.post<LockoutStatus>("/lockout/weekly", input);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["lockout-status"] });
    }
  });
}

export function useBrokerConnectionsQuery() {
  return useQuery({
    queryKey: ["broker-connections"],
    queryFn: async () => {
      const response = await api.get<BrokerConnectionsResponse>("/broker-connections");
      return response.data;
    }
  });
}

export function useBrokerConnectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (brokerId: string) => {
      const response = await api.get<BrokerConnectionAction>(
        `/broker-connections/${brokerId}/connect`
      );
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["broker-connections"] });
    }
  });
}

export function useJournalQuery() {
  return useQuery({
    queryKey: ["journal"],
    queryFn: async () => {
      const response = await api.get<JournalResponse>("/journal");
      return response.data;
    }
  });
}

export function useJournalSummaryQuery() {
  return useQuery({
    queryKey: ["journal-summary"],
    queryFn: async () => {
      const response = await api.get<JournalSummary>("/journal/summary");
      return response.data;
    }
  });
}

export function useJournalSyncMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post("/journal/sync");
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["journal"] }),
        queryClient.invalidateQueries({ queryKey: ["journal-summary"] }),
        queryClient.invalidateQueries({ queryKey: ["trade-limit"] }),
        queryClient.invalidateQueries({ queryKey: ["lockout-status"] }),
        queryClient.invalidateQueries({ queryKey: ["broker-connections"] })
      ]);
    }
  });
}
