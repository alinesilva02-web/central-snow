"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Ban,
  AlertTriangle,
  Inbox,
  Package,
  PackageCheck,
  PartyPopper,
  Search,
  Truck,
  Users,
} from "lucide-react";

import { contarClientes } from "../../lib/clientes";
import {
  contarEncomendas,
  listarEncomendas,
} from "../../lib/encomendas";

export default function DashboardPage() {
  const [clientes, setClientes] = useState(0);
  const [encomendas, setEncomendas] = useState(0);
  const [recebido, setRecebido] = useState(0);
  const [procurando, setProcurando] = useState(0);
  const [encontrado, setEncontrado] = useState(0);
  const [comprado, setComprado] = useState(0);
  const [transito, setTransito] = useState(0);
  const [chegou, setChegou] = useState(0);
  const [entregue, setEntregue] = useState(0);
  const [cancelado, setCancelado] = useState(0);
  const [atrasadas, setAtrasadas] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    carregarDashboard();
  }, []);

  async function carregarDashboard() {
    setCarregando(true);
    setErro(false);

    try {
      const [totalClientes, totalEncomendas, lista] = await Promise.all([
        contarClientes(),
        contarEncomendas(),
        listarEncomendas(),
      ]);

      setClientes(totalClientes);
      setEncomendas(totalEncomendas);
      setRecebido(
        lista.filter((item) => (item.status || "recebido") === "recebido")
          .length
      );
      setProcurando(
        lista.filter((item) => item.status === "procurando").length
      );
      setEncontrado(
        lista.filter((item) => item.status === "encontrado").length
      );
      setComprado(
        lista.filter((item) => item.status === "comprado").length
      );
      setTransito(
        lista.filter((item) => item.status === "transito").length
      );
      setChegou(lista.filter((item) => item.status === "chegou").length);
      setEntregue(
        lista.filter((item) => item.status === "entregue").length
      );
      setCancelado(
        lista.filter((item) => item.status === "cancelado").length
      );
      const limiteAtraso = Date.now() - 7 * 24 * 60 * 60 * 1000;
      setAtrasadas(
        lista.filter((item) => {
          const ultimaAtualizacao =
            item.status_atualizado_em || item.created_at;
          return (
            item.status !== "entregue" &&
            item.status !== "cancelado" &&
            !!ultimaAtualizacao &&
            Date.parse(ultimaAtualizacao) <= limiteAtraso
          );
        }).length
      );
    } catch (error) {
      console.error(error);
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }

  const resumo = [
    {
      titulo: "Clientes cadastrados",
      valor: clientes,
      Icone: Users,
      cor: "text-sky-700",
      fundo: "bg-sky-100",
    },
    {
      titulo: "Encomendas no total",
      valor: encomendas,
      Icone: Package,
      cor: "text-indigo-700",
      fundo: "bg-indigo-100",
    },
    {
      titulo: "Sem atualização há mais de 7 dias",
      valor: atrasadas,
      Icone: AlertTriangle,
      cor: "text-amber-700",
      fundo: "bg-amber-100",
    },
  ];

  const etapas = [
    {
      titulo: "Recebidas",
      valor: recebido,
      Icone: Inbox,
      cor: "text-sky-700",
      fundo: "bg-sky-50",
      borda: "border-sky-100",
    },
    {
      titulo: "Procurando",
      valor: procurando,
      Icone: Search,
      cor: "text-amber-700",
      fundo: "bg-amber-50",
      borda: "border-amber-100",
    },
    {
      titulo: "Encontradas",
      valor: encontrado,
      Icone: CheckCircle2,
      cor: "text-emerald-700",
      fundo: "bg-emerald-50",
      borda: "border-emerald-100",
    },
    {
      titulo: "Compradas",
      valor: comprado,
      Icone: CreditCard,
      cor: "text-violet-700",
      fundo: "bg-violet-50",
      borda: "border-violet-100",
    },
    {
      titulo: "Em trânsito",
      valor: transito,
      Icone: Truck,
      cor: "text-blue-700",
      fundo: "bg-blue-50",
      borda: "border-blue-100",
    },
    {
      titulo: "Chegaram",
      valor: chegou,
      Icone: PackageCheck,
      cor: "text-teal-700",
      fundo: "bg-teal-50",
      borda: "border-teal-100",
    },
    {
      titulo: "Entregues",
      valor: entregue,
      Icone: PartyPopper,
      cor: "text-rose-700",
      fundo: "bg-rose-50",
      borda: "border-rose-100",
    },
    {
      titulo: "Canceladas",
      valor: cancelado,
      Icone: Ban,
      cor: "text-slate-700",
      fundo: "bg-slate-100",
      borda: "border-slate-200",
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-sky-700">
            Central Snow
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Visão geral
          </h1>
          <p className="mt-2 text-slate-600">
            Acompanhe seus clientes e o andamento das encomendas.
          </p>
        </div>
        <p className="text-sm text-slate-500" role="status">
          {carregando
            ? "Atualizando informações..."
            : erro
              ? "Não foi possível atualizar"
              : "Dados atualizados"}
        </p>
      </header>

      {erro && (
        <div
          role="alert"
          className="mb-6 flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800 sm:flex-row sm:items-center sm:justify-between"
        >
          <p>Não foi possível carregar os indicadores.</p>
          <button
            type="button"
            onClick={carregarDashboard}
            className="w-fit rounded-lg bg-rose-700 px-4 py-2 font-semibold text-white transition hover:bg-rose-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
          >
            Tentar novamente
          </button>
        </div>
      )}

      <section
        aria-label="Resumo geral"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {resumo.map(({ titulo, valor, Icone, cor, fundo }) => (
          <article
            key={titulo}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-600">
                  {titulo}
                </h2>
                <p className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
                  {carregando || erro ? "—" : valor}
                </p>
              </div>
              <span className={`rounded-xl p-3 ${fundo} ${cor}`}>
                <Icone aria-hidden="true" size={22} />
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-10">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-950">
            Encomendas por etapa
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Veja quantos pedidos estão em cada parte do processo.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {etapas.map(({ titulo, valor, Icone, cor, fundo, borda }) => (
            <article
              key={titulo}
              className={`rounded-2xl border ${borda} ${fundo} p-4 transition hover:-translate-y-0.5 hover:shadow-sm sm:p-5`}
            >
              <div className="flex items-center gap-3">
                <span className={`rounded-lg bg-white p-2 ${cor}`}>
                  <Icone aria-hidden="true" size={20} />
                </span>
                <h3 className="font-semibold text-slate-700">{titulo}</h3>
              </div>
              <p className={`mt-4 text-3xl font-bold ${cor}`}>
                {carregando || erro ? "—" : valor}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {valor === 1 ? "encomenda" : "encomendas"}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
