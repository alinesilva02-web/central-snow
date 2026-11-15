"use client";

import { useState } from "react";
import { criarCliente } from "../../lib/clientes";

export default function ClientesPage() {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [observacoes, setObservacoes] = useState("");

async function salvarCliente() {
  try {
    await criarCliente(
      nome,
      whatsapp,
      tiktok,
      observacoes
    );

    alert("Cliente salvo com sucesso!");

    setNome("");
    setWhatsapp("");
    setTiktok("");
    setObservacoes("");

  } catch (error) {
    console.error(error);
    alert("Erro ao salvar cliente");
  }
}

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-6">
        👥 Clientes
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-md max-w-xl">
        <h2 className="text-xl font-semibold mb-4">
          Novo Cliente
        </h2>

        <input
          className="border rounded p-3 w-full mb-3"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          className="border rounded p-3 w-full mb-3"
          placeholder="WhatsApp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />

        <input
          className="border rounded p-3 w-full mb-3"
          placeholder="TikTok"
          value={tiktok}
          onChange={(e) => setTiktok(e.target.value)}
        />

        <textarea
          className="border rounded p-3 w-full mb-3"
          placeholder="Observações"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
        />

        <button
          onClick={salvarCliente}
          className="bg-sky-300 px-5 py-3 rounded-xl font-semibold"
        >
          Salvar Cliente
        </button>
      </div>
    </main>
  );
}