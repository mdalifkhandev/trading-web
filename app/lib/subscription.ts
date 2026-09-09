import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";

export type SubscriptionPlan = {
  code: "starter" | "starter_pro" | "enterprise";
  name: string;
  price: number;
  billingCycle: string;
  description: string;
  features: string[];
  popular?: boolean;
  selected: boolean;
};

export type CurrentSubscription = {
  id: string;
  plan: string;
  code: SubscriptionPlan["code"];
  status: string;
  price: number;
  billingCycle: string;
  startedAt: string;
  expiresAt: string;
  canceledAt: string | null;
  daysLeft: number;
};

export type SubscriptionOverview = {
  current: CurrentSubscription;
  plans: SubscriptionPlan[];
};

export function useSubscriptionQuery() {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const response = await api.get<SubscriptionOverview>("/subscription");
      return response.data;
    }
  });
}

export function useChangeSubscriptionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planCode: SubscriptionPlan["code"]) => {
      const response = await api.post<{ subscription: CurrentSubscription }>("/subscription/change", { planCode });
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["subscription"] }),
        queryClient.invalidateQueries({ queryKey: ["settings"] })
      ]);
    }
  });
}

export function useCancelSubscriptionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post<{ subscription: CurrentSubscription }>("/subscription/cancel");
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["subscription"] }),
        queryClient.invalidateQueries({ queryKey: ["settings"] })
      ]);
    }
  });
}
