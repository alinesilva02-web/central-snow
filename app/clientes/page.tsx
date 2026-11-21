"use client";

import { useState, useEffect } from "react";
import {
  criarCliente,
  listarClientes,
  atualizarCliente,
  excluirCliente,
  type Cliente,
} from "../../lib/clientes";
import {
  listarEncomendas,
  type Encomenda,
} from "../../lib/encomendas";

export default function ClientesPage() {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState("");
  const [encomendas, setEncomendas] = useState<Encomenda[]>([]);
  const [clienteExpandido, setClienteExpandido] = useState<string | null>(null);
  const [carregandoEncomendas, setCarregandoEncomendas] = useState(true);
  const [erroEncomendas, setErroEncomendas] = useState<string | null>(null);
  const [clienteEditando, setClienteEditando] = useState<string | null>(null);
  const [nomeEdicao, setNomeEdicao] = useState("");
  const [whatsappEdicao, setWhatsappEdicao] = useState("");
  const [tiktokEdicao, setTiktokEdicao] = useState("");
  const [observacoesEdicao, setObservacoesEdicao] = useState("");
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

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
    if (!nome.trim()) {
      alert("Informe o nome do cliente.");
      return;
    }

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

  function iniciarEdicao(cliente: Cliente) {
    setClienteEditando(cliente.id);
    setNomeEdicao(cliente.nome);
    setWhatsappEdicao(cliente.whatsapp);
    setTiktokEdicao(cliente.tiktok || "");
    setObservacoesEdicao(cliente.observacoes || "");
  }

  function cancelarEdicao() {
    setClienteEditando(null);
    setNomeEdicao("");
    setWhatsappEdicao("");
    setTiktokEdicao("");
    setObservacoesEdicao("");
  }

  async function salvarEdicao(id: string) {
    if (!nomeEdicao.trim()) {
      alert("Informe o nome do cliente.");
      return;
    }

    setSalvandoEdicao(true);

    try {
      await atualizarCliente(
        id,
        nomeEdicao.trim(),
        whatsappEdicao.trim(),
        tiktokEdicao.trim(),
        observacoesEdicao.trim()
      );

      alert("Cliente atualizado com sucesso!");
      cancelarEdicao();
      await carregarClientes();
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar cliente"
      );
    } finally {
      setSalvandoEdicao(false);
    }
  }

  async function removerCliente(cliente: Cliente) {
    const quantidadeEncomendas = encomendas.filter(
      (encomenda) => encomenda.cliente_id === cliente.id
    ).length;

    const confirmar = window.confirm(
      quantidadeEncomendas > 0
        ? `Tem certeza que deseja excluir o cliente "${cliente.nome}"?\n\nTodas as ${quantidadeEncomendas} encomenda(s) vinculada(s) também serão excluídas permanentemente.`
        : `Deseja excluir permanentemente o cliente "${cliente.nome}"?`
    );

    if (!confirmar) {
      return;
    }

    try {
      await excluirCliente(cliente.id);
      alert("Cliente excluído com sucesso!");
      await carregarClientes();
      await carregarEncomendas();
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Erro ao excluir cliente"
      );
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
              {clienteEditando === cliente.id ? (
                <div className="space-y-3">
                  <input
                    className="w-full rounded border p-3"
                    placeholder="Nome"
                    value={nomeEdicao}
                    onChange={(event) => setNomeEdicao(event.target.value)}
                  />
                  <input
                    className="w-full rounded border p-3"
                    placeholder="WhatsApp"
                    value={whatsappEdicao}
                    onChange={(event) => setWhatsappEdicao(event.target.value)}
                  />
                  <input
                    className="w-full rounded border p-3"
                    placeholder="TikTok"
                    value={tiktokEdicao}
                    onChange={(event) => setTiktokEdicao(event.target.value)}
                  />
                  <textarea
                    className="w-full rounded border p-3"
                    placeholder="Observações"
                    value={observacoesEdicao}
                    onChange={(event) => setObservacoesEdicao(event.target.value)}
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={salvandoEdicao}
                      onClick={() => salvarEdicao(cliente.id)}
                      className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {salvandoEdicao ? "Salvando..." : "Salvar alterações"}
                    </button>
                    <button
                      type="button"
                      disabled={salvandoEdicao}
                      onClick={cancelarEdicao}
                      className="rounded-lg bg-slate-200 px-4 py-2 font-semibold text-slate-800"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-bold">
                    👤 {cliente.nome}
                  </h3>

                  <p>📱 {cliente.whatsapp}</p>

                  {cliente.tiktok && (
                    <p>🎵 {cliente.tiktok}</p>
                  )}

                  {cliente.observacoes && (
                    <p>📝 {cliente.observacoes}</p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
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
                      className="rounded-lg bg-sky-100 px-4 py-2 font-semibold"
                    >
                      {clienteExpandido === cliente.id
                        ? "Ocultar encomendas"
                        : carregandoEncomendas || erroEncomendas
                          ? "Ver encomendas"
                          : `Ver encomendas (${encomendasDoCliente.length})`}
                    </button>
                    <button
                      type="button"
                      onClick={() => iniciarEdicao(cliente)}
                      className="rounded-lg bg-amber-100 px-4 py-2 font-semibold text-amber-900"
                    >
                      Alterar
                    </button>
                    <button
                      type="button"
                      onClick={() => removerCliente(cliente)}
                      className="rounded-lg bg-rose-100 px-4 py-2 font-semibold text-rose-800"
                    >
                      Excluir
                    </button>
                  </div>
                </>
              )}

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