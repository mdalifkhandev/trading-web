import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import type { AuthUser } from "../store/auth-store";

type AuthResponse = {
  user: AuthUser;
  token: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type SignupInput = LoginInput & {
  name: string;
};

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const response = await api.post<AuthResponse>("/auth/login", input);
      return response.data;
    }
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: async (input: SignupInput) => {
      const response = await api.post<AuthResponse>("/auth/register", input);
      return response.data;
    }
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: async (input: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
      const response = await api.patch("/auth/change-password", input);
      return response.data;
    }
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { name?: string; email?: string; avatar?: string }) => {
      const response = await api.patch("/auth/me", input);
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
    }
  });
}

export function useLogoutAllSessionsMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/logout-all");
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["settings"] });
    }
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/logout");
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.clear();
    }
  });
}

export function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return "Something went wrong. Please try again.";
}
