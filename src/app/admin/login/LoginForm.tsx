"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="block">
        <span className="text-sm font-semibold text-forest-dark block mb-1.5">Email</span>
        <input type="email" name="email" required autoComplete="username" placeholder="admin@patakidigital.co.tz" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-forest-dark block mb-1.5">Password</span>
        <input type="password" name="password" required autoComplete="current-password" />
      </label>
      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary mt-2">
        {pending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
