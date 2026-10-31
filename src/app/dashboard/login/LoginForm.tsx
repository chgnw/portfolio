"use client";

import { useActionState } from "react";
import { FiLock } from "react-icons/fi";
import { loginAction } from "./actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="w-full max-w-sm p-8 rounded-2xl glass-effect space-y-5 shadow-2xl">
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary">
          <FiLock size={22} />
        </div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-foreground/60">Owner access only.</p>
      </div>

      <label className="block space-y-1">
        <span className="text-sm text-foreground/80">Email</span>
        <input
          name="email"
          type="email"
          // React resets the form after each submit; keep the email that was typed.
          key={state?.email}
          defaultValue={state?.email ?? ""}
          autoComplete="username"
          required
          className="w-full p-3 rounded-lg bg-black/30 border border-white/10 focus:border-primary outline-none"
        />
      </label>
      <label className="block space-y-1">
        <span className="text-sm text-foreground/80">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full p-3 rounded-lg bg-black/30 border border-white/10 focus:border-primary outline-none"
        />
      </label>

      {state?.error && (
        <p role="alert" className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-3 rounded-lg font-semibold bg-primary text-gray-900 hover:opacity-90 disabled:opacity-60 transition"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
