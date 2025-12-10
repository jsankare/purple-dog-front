// lib/api/auth.ts
import { apiClient } from "./client";

export type Gender = "male" | "female" | "other";

export type RegisterInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: Gender;
};

export async function registerUser(input: RegisterInput) {
  return apiClient.post("/users/register", input);
}

export async function loginUser(email: string, password: string) {
  return apiClient.post("/users/login", { email, password });
}

export async function forgotPassword(email: string) {
  return apiClient.post("/users/forgot-password", { email });
}

export async function resetPassword(token: string, password: string) {
  return apiClient.post("/users/reset-password", { token, password });
}