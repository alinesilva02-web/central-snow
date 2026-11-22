"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [entrando, setEntrando] = useState(false);

  async function entrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);
    setEntrando(true);

    try {
      const { error: erroLogin } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: senha,
      });

      if (erroLogin) {
        throw erroLogin;
      }

      const { data: administrador, error: erroPermissao } =
        await supabase.rpc("is_admin");

      if (erroPermissao) {
        throw erroPermissao;
      }

      router.replace(administrador ? "/dashboard" : "/portal");
    } catch (error) {
      console.error(error);
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível entrar."
      );
    } finally {
      setEntrando(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-bold text-slate-950">Entrar</h1>
        <p className="mt-2 text-slate-600">
          Acesse sua conta Central Snow.
        </p>

        <form onSubmit={entrar} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email-login" className="mb-1 block font-medium">
              E-mail
            </label>
            <input
              id="email-login"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border p-3"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="senha-login" className="mb-1 block font-medium">
              Senha
            </label>
            <input
              id="senha-login"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border p-3"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
            />
          </div>
          {erro && (
            <p role="alert" className="text-sm text-rose-700">
              {erro}
            </p>
          )}
          <button
            type="submit"
            disabled={entrando}
            className="w-full rounded-lg bg-sky-700 px-4 py-3 font-semibold text-white hover:bg-sky-800 disabled:opacity-60"
          >
            {entrando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-600">
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="font-semibold text-sky-800 underline">
            Cadastre-se
          </Link>
        </p>
      </section>
    </main>
  );
}
