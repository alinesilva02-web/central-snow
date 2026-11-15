"use client";

import { useEffect, useState } from "react";

import {
  buscarCliente,
} from "../../../lib/clientes";

import {
  listarEncomendasPorCliente,
} from "../../../lib/encomendas";

export default function ClientePage({
  params,
}: {
  params: { id: string };
}) {
  const [cliente, setCliente] =
    useState<any>(null);

  const [encomendas, setEncomendas] =
    useState<any[]>([]);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const dadosCliente =
      await buscarCliente(params.id);

    const dadosEncomendas =
      await listarEncomendasPorCliente(
        params.id
      );

    setCliente(dadosCliente);
    setEncomendas(dadosEncomendas);
  }

  if (!cliente) {
    return (
      <main className="p-10">
        Carregando...
      </main>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-4">
        👤 {cliente.nome}
      </h1>

      <p>
        📱 {cliente.whatsapp}
      </p>

      <p>
        🎵 {cliente.tiktok}
      </p>

      <hr className="my-6" />

      <h2 className="text-2xl font-bold mb-4">
        📦 Encomendas
      </h2>

      <div className="space-y-3">
        {encomendas.map(
          (encomenda) => (
            <div
              key={encomenda.id}
              className="border p-4 rounded-xl"
            >
              <h3 className="font-bold">
                {encomenda.produto}
              </h3>

              <p>
                🎀 {encomenda.personagem}
              </p>

              <p>
                📏 {encomenda.tamanho}
              </p>

              <p>
                📋 {encomenda.status}
              </p>
            </div>
          )
        )}
      </div>
    </main>
  );
}