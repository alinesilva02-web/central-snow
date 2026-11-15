"use client";

import { useState, useEffect } from "react";
import {
  criarEncomenda,
  listarEncomendas,
  atualizarStatus,
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

  const [statusSelecionado, setStatusSelecionado] =
    useState<Record<string, string>>({});

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

      const statusInicial: Record<
        string,
        string
      > = {};

      (dados || []).forEach((item) => {
        statusInicial[item.id] =
          item.status || "recebido";
      });

      setStatusSelecionado(statusInicial);
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

      alert(
        "Encomenda salva com sucesso!"
      );

      setClienteId("");
      setProduto("");
      setPersonagem("");
      setTamanho("");
      setQuantidade(1);

      await carregarEncomendas();
    } catch (error) {
      console.error(error);

      alert(
        "Erro ao salvar encomenda"
      );
    }
  }

  async function salvarStatus(
    id: string
  ) {
    const novoStatus =
      statusSelecionado[id];

    const confirmar = window.confirm(
      `Deseja realmente alterar o status para "${novoStatus}"?`
    );

    if (!confirmar) {
      return;
    }

    try {
      await atualizarStatus(
        id,
        novoStatus
      );

      alert(
        "Status atualizado com sucesso!"
      );

      await carregarEncomendas();
    } catch (error) {
      console.error(error);

      alert(
        "Erro ao atualizar status"
      );
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
            setQuantidade(
              Number(e.target.value)
            )
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

      <div className="space-y-4">
        {encomendas.map((encomenda) => (
          <div
            key={encomenda.id}
            className="border p-4 rounded-xl"
          >
            <h3 className="font-bold text-lg">
              📦 {encomenda.produto}
            </h3>

            <p>
              👤 {
                clientes.find(
                  (cliente) =>
                    cliente.id ===
                    encomenda.cliente_id
                )?.nome ||
                "Cliente não encontrado"
              }
            </p>

            <p>
              🎀 {encomenda.personagem}
            </p>

            <p>
              📏 {encomenda.tamanho}
            </p>

            <p>
              🔢 {encomenda.quantidade}
            </p>

            <p className="mt-2">
              Status Atual:
              <strong>
                {" "}
                {encomenda.status ||
                  "recebido"}
              </strong>
            </p>

            <div className="mt-3 flex gap-3 items-center">
              <select
                className="border rounded p-2"
                value={
                  statusSelecionado[
                    encomenda.id
                  ] || "recebido"
                }
                onChange={(e) =>
                  setStatusSelecionado({
                    ...statusSelecionado,
                    [encomenda.id]:
                      e.target.value,
                  })
                }
              >
                <option value="recebido">
                  📥 Recebido
                </option>

                <option value="procurando">
                  🔍 Procurando
                </option>

                <option value="encontrado">
                  ✅ Encontrado
                </option>

                <option value="comprado">
                  💳 Comprado
                </option>

                <option value="transito">
                  🚚 Em trânsito
                </option>

                <option value="chegou">
                  📦 Chegou
                </option>

                <option value="entregue">
                  🎉 Entregue
                </option>
              </select>

              <button
                onClick={() =>
                  salvarStatus(
                    encomenda.id
                  )
                }
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                💾 Salvar Status
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}