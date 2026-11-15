"use client";

import { useState, useEffect } from "react";
import {
  criarCliente,
  listarClientes,
} from "../../lib/clientes";
import { listarEncomendas } from "../../lib/encomendas";

export default function ClientesPage() {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [clientes, setClientes] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [encomendas, setEncomendas] = useState<any[]>([]);
  const [clienteExpandido, setClienteExpandido] = useState<string | null>(null);
  const [carregandoEncomendas, setCarregandoEncomendas] = useState(true);
  const [erroEncomendas, setErroEncomendas] = useState<string | null>(null);

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
    setCarregandoEncomendas(true);

    try {
      const dados = await listarEncomendas();
      setEncomendas(dados || []);
      setErroEncomendas(null);
    } catch (error) {
      console.error(error);
      setErroEncomendas("Não foi possível carregar as encomendas.");
    } finally {
      setCarregandoEncomendas(false);
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

  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.nome
        ?.toLowerCase()
        .includes(busca.toLowerCase())
  );

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
          onChange={(e) =>
            setNome(e.target.value)
          }
        />

        <input
          className="border rounded p-3 w-full mb-3"
          placeholder="WhatsApp"
          value={whatsapp}
          onChange={(e) =>
            setWhatsapp(e.target.value)
          }
        />

        <input
          className="border rounded p-3 w-full mb-3"
          placeholder="TikTok"
          value={tiktok}
          onChange={(e) =>
            setTiktok(e.target.value)
          }
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

      <input
        className="border rounded p-3 w-full mb-5 max-w-xl"
        placeholder="🔍 Buscar cliente pelo nome"
        value={busca}
        onChange={(e) =>
          setBusca(e.target.value)
        }
      />

      <div className="space-y-3">
        {clientesFiltrados.map((cliente) => {
          const encomendasDoCliente = encomendas.filter(
            (encomenda) => encomenda.cliente_id === cliente.id
          );

          return (
            <div
              key={cliente.id}
              className="border p-4 rounded-xl"
            >
              <h3 className="font-bold">
                👤 {cliente.nome}
              </h3>

              <p>
                📱 {cliente.whatsapp}
              </p>

              {cliente.tiktok && (
                <p>
                  🎵 {cliente.tiktok}
                </p>
              )}

              {cliente.observacoes && (
                <p>
                  📝 {cliente.observacoes}
                </p>
              )}

              <button
                type="button"
                aria-expanded={clienteExpandido === cliente.id}
                aria-controls={`encomendas-${cliente.id}`}
                onClick={() =>
                  setClienteExpandido(
                    clienteExpandido === cliente.id
                      ? null
                      : cliente.id
                  )
                }
                className="mt-3 rounded-lg bg-sky-100 px-4 py-2 font-semibold"
              >
                {clienteExpandido === cliente.id
                  ? "Ocultar encomendas"
                  : carregandoEncomendas || erroEncomendas
                    ? "Ver encomendas"
                    : `Ver encomendas (${encomendasDoCliente.length})`}
              </button>

              {clienteExpandido === cliente.id && (
                <div
                  id={`encomendas-${cliente.id}`}
                  className="mt-4 space-y-3 border-t pt-4"
                >
                  {carregandoEncomendas ? (
                    <p>Carregando encomendas...</p>
                  ) : erroEncomendas ? (
                    <div>
                      <p role="alert">{erroEncomendas}</p>
                      <button
                        type="button"
                        onClick={carregarEncomendas}
                        className="mt-2 rounded-lg bg-sky-100 px-4 py-2 font-semibold"
                      >
                        Tentar novamente
                      </button>
                    </div>
                  ) : (
                    <>
                      {encomendasDoCliente.map((encomenda) => (
                        <div
                          key={encomenda.id}
                          className="rounded-lg bg-slate-50 p-3"
                        >
                          <h4 className="font-semibold">
                            📦 {encomenda.produto}
                          </h4>
                          <p>
                            🎀 Personagem: {encomenda.personagem || "Não informado"}
                          </p>
                          <p>
                            📏 Tamanho: {encomenda.tamanho || "Não informado"}
                          </p>
                          <p>🔢 Quantidade: {encomenda.quantidade}</p>
                          <p>Status: {encomenda.status || "recebido"}</p>
                        </div>
                      ))}
                      {encomendasDoCliente.length === 0 && (
                        <p>Este cliente ainda não tem encomendas.</p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}