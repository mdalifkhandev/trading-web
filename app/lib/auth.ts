import { useMutation } from "@tanstack/react-query";
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
