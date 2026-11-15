"use client";

import { useState, useEffect } from "react";
import {
  criarCliente,
  listarClientes,
} from "../../lib/clientes";

export default function ClientesPage() {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [clientes, setClientes] = useState<any[]>([]);

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    try {
      const dados = await listarClientes();
      setClientes(dados || []);
    } catch (error) {
      console.error(error);
    }
  }

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

      await carregarClientes();
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
          onChange={(e) =>
            setObservacoes(e.target.value)
          }
        />

        <button
          onClick={salvarCliente}
          className="bg-sky-300 px-5 py-3 rounded-xl font-semibold"
        >
          Salvar Cliente
        </button>
      </div>

      <hr className="my-8" />

      <h2 className="text-2xl font-bold mb-4">
        Clientes Cadastrados
      </h2>

      <div className="space-y-3">
        {clientes.map((cliente) => (
          <div
            key={cliente.id}
            className="border p-4 rounded-xl"
          >
            <h3 className="font-bold">
              {cliente.nome}
            </h3>

            <p>
              📱 {cliente.whatsapp}
            </p>

            {cliente.tiktok && (
              <p>
                🎵 {cliente.tiktok}
              </p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}