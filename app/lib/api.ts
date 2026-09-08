import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050"
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const token = getPersistedAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function getPersistedAuthToken() {
  const persistedAuth = window.localStorage.getItem("tradelmt-auth");

  if (!persistedAuth) {
    return null;
  }

  try {
    const parsed = JSON.parse(persistedAuth) as { state?: { token?: unknown } };
    return typeof parsed.state?.token === "string" ? parsed.state.token : null;
  } catch {
    return null;
  }
}
