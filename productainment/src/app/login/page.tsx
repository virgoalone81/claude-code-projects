"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  if (status === "sent") {
    return (
      <div className="card mx-auto mt-16 max-w-md space-y-2 text-center">
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="text-muted">We sent a login link to {email}. Tap it to get in.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card mx-auto mt-16 max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Log in or sign up</h1>
      <p className="text-sm text-muted">No password. We email you a link.</p>
      <input
        type="email"
        required
        className="field"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn w-full" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Email me a login link"}
      </button>
      {status === "error" && <p className="text-sm text-red-400">{error}</p>}
    </form>
  );
}
