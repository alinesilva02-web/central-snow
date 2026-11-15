"use client";

import { useState, useEffect } from "react";
import {
  criarEncomenda,
  listarEncomendas,
} from "../../lib/encomendas";

import {
  listarClientes,
} from "../../lib/clientes";

export default function EncomendasPage() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [encomendas, setEncomendas] = useState<any[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [produto, setProduto] = useState("");
  const [personagem, setPersonagem] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    carregarClientes();
    carregarEncomendas();
  }, []);

  async function carregarClientes() {
    try {
      const dados = await listarClientes();
      setClientes(dados || []);
    } catch (error) {
      console.error(error);
    }
  }

  async function carregarEncomendas() {
    try {
      const dados = await listarEncomendas();
      setEncomendas(dados || []);
    } catch (error) {
      console.error(error);
    }
  }

  async function salvarEncomenda() {
    try {
      await criarEncomenda(
        clienteId,
        produto,
        personagem,
        tamanho,
        quantidade
      );

      alert("Encomenda salva com sucesso!");

      setClienteId("");
      setProduto("");
      setPersonagem("");
      setTamanho("");
      setQuantidade(1);

      await carregarEncomendas();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar encomenda");
    }
  }

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-6">
        📦 Encomendas
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-md max-w-xl">
        <h2 className="text-xl font-semibold mb-4">
          Nova Encomenda
        </h2>

        <select
          className="border rounded p-3 w-full mb-3"
          value={clienteId}
          onChange={(e) =>
            setClienteId(e.target.value)
          }
        >
          <option value="">
            Selecione um cliente
          </option>

          {clientes.map((cliente) => (
            <option
              key={cliente.id}
              value={cliente.id}
            >
              {cliente.nome}
            </option>
          ))}
        </select>

        <input
          className="border rounded p-3 w-full mb-3"
          placeholder="Produto"
          value={produto}
          onChange={(e) =>
            setProduto(e.target.value)
          }
        />

        <input
          className="border rounded p-3 w-full mb-3"
          placeholder="Personagem"
          value={personagem}
          onChange={(e) =>
            setPersonagem(e.target.value)
          }
        />

        <input
          className="border rounded p-3 w-full mb-3"
          placeholder="Tamanho"
          value={tamanho}
          onChange={(e) =>
            setTamanho(e.target.value)
          }
        />

        <input
          type="number"
          min="1"
          className="border rounded p-3 w-full mb-3"
          value={quantidade}
          onChange={(e) =>
            setQuantidade(Number(e.target.value))
          }
        />

        <button
          onClick={salvarEncomenda}
          className="bg-sky-300 px-5 py-3 rounded-xl font-semibold"
        >
          Salvar Encomenda
        </button>
      </div>

      <hr className="my-8" />

      <h2 className="text-2xl font-bold mb-4">
        Encomendas Cadastradas
      </h2>

      <div className="space-y-3">
        {encomendas.map((encomenda) => (
          <div
            key={encomenda.id}
            className="border p-4 rounded-xl"
          >
            <h3 className="font-bold">
              📦 {encomenda.produto}
            </h3>

            <p>
              🎀 {encomenda.personagem}
            </p>

            <p>
              📏 {encomenda.tamanho}
            </p>

            <p>
              🔢 {encomenda.quantidade}
            </p>

            <p>
              📋 {encomenda.status}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}