"use server";

import { redirect } from "next/navigation";
import { login } from "@/lib/auth/session";

export type LoginState = { error: string; email: string } | null;

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").slice(0, 320);
  const password = String(formData.get("password") ?? "").slice(0, 200);
  if (!email || !password) return { error: "Enter your email and password.", email };

  const result = await login(email, password);
  if (!result.ok) return { error: result.error, email };
  redirect("/dashboard");
}
