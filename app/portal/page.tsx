"use client";

import { FormEvent, useEffect, useState } from "react";

import type { Cliente } from "../../lib/clientes";
import {
  criarEncomenda,
  listarEncomendas,
  type Encomenda,
} from "../../lib/encomendas";
import { supabase } from "../../lib/supabase";

export default function PortalClientePage() {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [encomendas, setEncomendas] = useState<Encomenda[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [produto, setProduto] = useState("");
  const [personagem, setPersonagem] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [dataSolicitacao, setDataSolicitacao] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      setCarregando(true);
      setErro(null);

      try {
        const { data: usuario, error: erroUsuario } =
          await supabase.auth.getUser();
        if (erroUsuario) {
          throw erroUsuario;
        }
        if (!usuario.user) {
          throw new Error("Entre na sua conta para continuar.");
        }

        const [resultadoCliente, resultadoEncomendas] = await Promise.all([
          supabase
            .from("clientes")
            .select("id, nome, whatsapp, tiktok, observacoes")
            .eq("auth_user_id", usuario.user.id)
            .single(),
          listarEncomendas(),
        ]);

        if (resultadoCliente.error) {
          throw resultadoCliente.error;
        }

        if (ativo) {
          setCliente(resultadoCliente.data);
          setEncomendas(resultadoEncomendas);
        }
      } catch (error) {
        console.error(error);
        if (ativo) {
          setErro(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar sua conta."
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void carregarDados();

    return () => {
      ativo = false;
    };
  }, []);

  async function enviarEncomenda(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!cliente) {
      setErro("Não encontramos seu cadastro. Entre em contato com a loja.");
      return;
    }

    if (!Number.isInteger(quantidade) || quantidade < 1) {
      setErro("A quantidade deve ser um número inteiro maior que zero.");
      return;
    }

    if (!dataSolicitacao) {
      setErro("Informe a data da solicitação.");
      return;
    }

    setSalvando(true);
    setErro(null);

    try {
      await criarEncomenda(
        cliente.id,
        produto.trim(),
        personagem.trim(),
        tamanho.trim(),
        quantidade,
        undefined,
        observacoes.trim(),
        dataSolicitacao
      );

      setProduto("");
      setPersonagem("");
      setTamanho("");
      setQuantidade(1);
      setDataSolicitacao("");
      setObservacoes("");

      const listaAtualizada = await listarEncomendas();
      setEncomendas(listaAtualizada);
    } catch (error) {
      console.error(error);
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar a encomenda."
      );
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return <main className="mx-auto max-w-4xl p-8">Carregando sua conta...</main>;
  }

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6">
      <header>
        <p className="text-sm font-bold uppercase tracking-wider text-sky-700">
          Área do cliente
        </p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">
          Olá, {cliente?.nome || "cliente"}
        </h1>
        <p className="mt-2 text-slate-600">
          Envie uma encomenda e acompanhe somente os seus pedidos.
        </p>
      </header>

      {erro && (
        <p role="alert" className="rounded-lg bg-rose-50 p-4 text-rose-800">
          {erro}
        </p>
      )}

      {cliente && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Cadastrar encomenda</h2>
          <form onSubmit={enviarEncomenda} className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 font-medium text-slate-700">
              Produto
              <input
                required
                className="rounded-lg border p-3 font-normal"
                value={produto}
                onChange={(event) => setProduto(event.target.value)}
              />
            </label>
            <label className="grid gap-1 font-medium text-slate-700">
              Personagem
              <input
                className="rounded-lg border p-3 font-normal"
                value={personagem}
                onChange={(event) => setPersonagem(event.target.value)}
              />
            </label>
            <label className="grid gap-1 font-medium text-slate-700">
              Tamanho
              <input
                className="rounded-lg border p-3 font-normal"
                value={tamanho}
                onChange={(event) => setTamanho(event.target.value)}
              />
            </label>
            <label className="grid gap-1 font-medium text-slate-700">
              Quantidade
              <input
                type="number"
                min="1"
                step="1"
                required
                className="rounded-lg border p-3 font-normal"
                value={quantidade}
                onChange={(event) => setQuantidade(Number(event.target.value))}
              />
            </label>
            <label className="grid gap-1 font-medium text-slate-700">
              Data da solicitação
              <input
                type="date"
                required
                className="rounded-lg border p-3 font-normal"
                value={dataSolicitacao}
                onChange={(event) => setDataSolicitacao(event.target.value)}
              />
            </label>
            <label className="grid gap-1 font-medium text-slate-700 sm:col-span-2">
              Observações
              <textarea
                className="rounded-lg border p-3 font-normal"
                value={observacoes}
                onChange={(event) => setObservacoes(event.target.value)}
              />
            </label>
            <button
              type="submit"
              disabled={salvando}
              className="rounded-lg bg-sky-700 px-5 py-3 font-semibold text-white hover:bg-sky-800 disabled:opacity-60 sm:col-span-2"
            >
              {salvando ? "Enviando..." : "Enviar encomenda"}
            </button>
          </form>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-2xl font-bold">Minhas encomendas</h2>
        {encomendas.length === 0 ? (
          <p className="text-slate-600">Você ainda não enviou encomendas.</p>
        ) : (
          <div className="space-y-3">
            {encomendas.map((encomenda) => (
              <article
                key={encomenda.id}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <h3 className="font-bold">📦 {encomenda.produto}</h3>
                <p className="mt-1 text-slate-600">
                  Data:{" "}
                  {encomenda.data_solicitacao
                    ? new Date(
                        `${encomenda.data_solicitacao}T00:00:00`
                      ).toLocaleDateString("pt-BR")
                    : "Não informada"}
                  {" · "}Quantidade: {encomenda.quantidade}
                </p>
                <p className="mt-1">
                  Status: <strong>{encomenda.status || "recebido"}</strong>
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
