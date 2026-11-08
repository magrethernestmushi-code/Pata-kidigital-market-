"use client";

import { useActionState } from "react";
import { businessSignupAction } from "./actions";

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(businessSignupAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Business Name">
        <input name="businessName" required placeholder="e.g. Amina's Fashion House" />
      </Field>
      <Field label="Your Name" optional>
        <input name="ownerName" placeholder="Owner / manager name" />
      </Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Email">
          <input type="email" name="email" required autoComplete="username" />
        </Field>
        <Field label="Password">
          <input type="password" name="password" required minLength={6} autoComplete="new-password" />
        </Field>
      </div>
      <Field label="WhatsApp Number" hint="International format, e.g. 255712345678">
        <input name="whatsappNumber" required placeholder="255712345678" inputMode="numeric" />
      </Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Instagram" optional>
          <input name="instagramHandle" placeholder="@yourbusiness" />
        </Field>
        <Field label="TikTok" optional>
          <input name="tiktokHandle" placeholder="@yourbusiness" />
        </Field>
      </div>
      <Field label="Location" optional>
        <input name="location" placeholder="e.g. Kariakoo, Dar es Salaam" />
      </Field>
      <Field label="About your business" optional>
        <textarea name="description" rows={3} placeholder="What do you sell?" />
      </Field>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <p className="text-xs text-charcoal/50">
        Your first month is free. After that, staying listed costs TZS 30,000/month — you&apos;ll
        get a reminder from us and nothing is auto-charged.
      </p>

      <button type="submit" disabled={pending} className="btn-primary mt-1">
        {pending ? "Creating account..." : "Create Free Account"}
      </button>
    </form>
  );
}

function Field({
  label,
  children,
  optional,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  optional?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-forest-dark block mb-1.5">
        {label}
        {optional && <span className="font-normal text-charcoal/40"> (optional)</span>}
      </span>
      {children}
      {hint && <span className="text-xs text-charcoal/50 mt-1 block">{hint}</span>}
    </label>
  );
}
