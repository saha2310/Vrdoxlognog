"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAdmin } from "@/app/actions/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/Feedback";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await loginAdmin(email, password);

    if (!result.success) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    const redirectTo = searchParams.get("redirectTo") || "/admin";
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-sm border border-line bg-bone p-8 flex flex-col gap-5"
    >
      <div>
        <p className="spec-tag inline-block px-2 py-1 mb-3">Вход</p>
        <h1 className="font-display text-2xl text-ink">Админ-панель</h1>
      </div>

      {error && <ErrorMessage message={error} />}

      <Input
        id="email"
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="username"
      />
      <Input
        id="password"
        type="password"
        label="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />

      <Button type="submit" disabled={loading} className="mt-2">
        {loading ? "Входим…" : "Войти"}
      </Button>
    </form>
  );
}
