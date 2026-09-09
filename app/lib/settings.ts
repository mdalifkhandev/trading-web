import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import type { AuthUser } from "../store/auth-store";
import type { BrokerConnectionsResponse, LockoutStatus, TradeLimitResponse } from "./dashboard";

export type SettingsOverview = {
  user: AuthUser & {
    createdAt: string;
    updatedAt: string;
  };
  subscription: {
    plan: string;
    code: string;
    price: number;
    billingCycle: string;
    startedAt: string;
    expiresAt: string;
    canceledAt: string | null;
    daysLeft: number;
    status: string;
  };
  brokerConnections: BrokerConnectionsResponse;
  restrictions: {
    status: "locked" | "active" | "inactive";
    tradeLimit: TradeLimitResponse["tradeLimit"];
    remainingTrades: number | null;
    lockoutStatus: LockoutStatus;
    maxPositionSize: number | null;
    instruments: string;
    riskLevel: string;
  };
  accountSettings: {
    twoFactorAuthentication: boolean;
    deviceManagement: boolean;
    loginSessions: number;
  };
  system: {
    os: string;
    version: string;
    lastLogin: string;
    accountType: string;
  };
};

export function useSettingsQuery() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await api.get<SettingsOverview>("/settings");
      return response.data;
    }
  });
}

export function useResetRestrictionsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post("/settings/reset-restrictions");
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["settings"] }),
        queryClient.invalidateQueries({ queryKey: ["trade-limit"] }),
        queryClient.invalidateQueries({ queryKey: ["lockout-status"] })
      ]);
    }
  });
}

export function useUpdateRestrictionSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      maxPositionSize?: number | null;
      instruments?: string;
      riskLevel?: string;
    }) => {
      const response = await api.patch("/settings/restrictions", input);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
    }
  });
}

export function useDeleteAccountMutation() {
  return useMutation({
    mutationFn: async () => {
      const response = await api.delete("/settings/account");
      return response.data;
    }
  });
}

export function useUpdateAccountSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { twoFactorAuthentication?: boolean; password?: string }) => {
      const response = await api.patch("/settings/account", input);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
    }
  });
}

export type DeviceSession = {
  id: string;
  userId: string;
  device: string;
  ipAddress: string | null;
  isActive: boolean;
  lastActive: string;
  createdAt: string;
};

export function useDevicesQuery() {
  return useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      const response = await api.get<DeviceSession[]>("/settings/devices");
      return response.data;
    }
  });
}

export function useRevokeDeviceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await api.delete(`/settings/devices/${sessionId}`);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["devices"] });
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
    }
  });
}
