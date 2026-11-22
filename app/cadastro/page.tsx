"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { supabase } from "../../lib/supabase";

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [cadastrando, setCadastrando] = useState(false);

  async function cadastrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);
    setMensagem(null);

    if (!nome.trim() || !whatsapp.trim()) {
      setErro("Informe seu nome e WhatsApp.");
      return;
    }

    if (senha.length < 8) {
      setErro("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setCadastrando(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: senha,
        options: {
          data: {
            tipo_conta: "cliente",
            nome: nome.trim(),
            whatsapp: whatsapp.trim(),
          },
          emailRedirectTo: `${window.location.origin}/portal`,
        },
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        router.replace("/portal");
      } else {
        setMensagem(
          "Cadastro recebido. Confira seu e-mail para confirmar a conta e depois entre."
        );
      }
    } catch (error) {
      console.error(error);
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível criar sua conta."
      );
    } finally {
      setCadastrando(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-bold text-slate-950">
          Cadastro do cliente
        </h1>
        <p className="mt-2 text-slate-600">
          Crie sua conta para enviar e acompanhar suas próprias encomendas.
        </p>

        <form onSubmit={cadastrar} className="mt-6 space-y-4">
          <div>
            <label htmlFor="nome-cadastro" className="mb-1 block font-medium">
              Nome completo
            </label>
            <input
              id="nome-cadastro"
              autoComplete="name"
              required
              className="w-full rounded-lg border p-3"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="whatsapp-cadastro" className="mb-1 block font-medium">
              WhatsApp
            </label>
            <input
              id="whatsapp-cadastro"
              type="tel"
              autoComplete="tel"
              required
              className="w-full rounded-lg border p-3"
              value={whatsapp}
              onChange={(event) => setWhatsapp(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email-cadastro" className="mb-1 block font-medium">
              E-mail
            </label>
            <input
              id="email-cadastro"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border p-3"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="senha-cadastro" className="mb-1 block font-medium">
              Senha (mínimo 8 caracteres)
            </label>
            <input
              id="senha-cadastro"
              type="password"
              autoComplete="new-password"
              minLength={8}
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
          {mensagem && (
            <p role="status" className="text-sm text-emerald-800">
              {mensagem}
            </p>
          )}
          <button
            type="submit"
            disabled={cadastrando}
            className="w-full rounded-lg bg-sky-700 px-4 py-3 font-semibold text-white hover:bg-sky-800 disabled:opacity-60"
          >
            {cadastrando ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-600">
          Já tem conta?{" "}
          <Link href="/login" className="font-semibold text-sky-800 underline">
            Entrar
          </Link>
        </p>
      </section>
    </main>
  );
}
