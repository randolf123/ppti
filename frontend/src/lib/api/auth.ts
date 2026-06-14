import { api, unwrapData } from "./client";
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  User,
} from "@/types";

export async function login(input: LoginInput): Promise<AuthResponse> {
  const res = await api.post("/api/auth/login", input);
  const data = unwrapData<AuthResponse>(res);
  // Store token & user
  localStorage.setItem("ppti_token", data.token);
  localStorage.setItem("ppti_user", JSON.stringify(data.user));
  localStorage.setItem("ppti_role", data.role);
  return data;
}

export async function register(input: RegisterInput): Promise<User> {
  const res = await api.post("/api/auth/register", input);
  return unwrapData<User>(res);
}

export async function getMe(): Promise<{ user: User; role: string }> {
  const res = await api.get("/api/users/me");
  return unwrapData<{ user: User; role: string }>(res);
}

export function logout() {
  localStorage.removeItem("ppti_token");
  localStorage.removeItem("ppti_user");
  localStorage.removeItem("ppti_role");
  window.location.href = "/login";
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ppti_token");
}

export function getStoredRole(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ppti_role");
}
