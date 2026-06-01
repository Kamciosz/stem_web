"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setError("Niepoprawny token dostepu.");
      return;
    }

    router.push("/adminpanel");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-[#d7e4df] bg-white p-6">
      <label className="block text-sm font-semibold" htmlFor="token">
        Token administratora
      </label>
      <input
        id="token"
        type="password"
        autoComplete="current-password"
        value={token}
        onChange={(event) => setToken(event.target.value)}
        className="w-full rounded-xl border border-[#c5d6d0] px-4 py-2 outline-none transition focus:border-[var(--accent)]"
        required
      />
      {error && <p className="text-sm font-medium text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-[var(--accent)] px-4 py-2 font-semibold text-white disabled:opacity-60"
      >
        {isSubmitting ? "Sprawdzanie..." : "Zaloguj"}
      </button>
    </form>
  );
}
