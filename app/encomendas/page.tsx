"use client";

import { useState, useEffect, useRef } from "react";
import {
  criarEncomenda,
  listarEncomendas,
  atualizarStatus,
  removerFotoEncomenda,
  type Encomenda,
} from "../../lib/encomendas";

import {
  listarClientes,
  type Cliente,
} from "../../lib/clientes";

import { excluirImagem, uploadImagem } from "../../lib/storage";

export default function EncomendasPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [encomendas, setEncomendas] = useState<Encomenda[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [produto, setProduto] = useState("");
  const [personagem, setPersonagem] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [observacoes, setObservacoes] = useState("");
  const [dataSolicitacao, setDataSolicitacao] = useState("");

  const [arquivo, setArquivo] =
    useState<File | null>(null);

  const [fotoUrl, setFotoUrl] =
    useState("");

  const [salvandoEncomenda, setSalvandoEncomenda] =
    useState(false);
  const [enviandoFoto, setEnviandoFoto] =
    useState(false);
  const arquivoInputRef = useRef<HTMLInputElement>(null);
  const [removendoFotoId, setRemovendoFotoId] =
    useState<string | null>(null);

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
    if (!clienteId || !produto.trim()) {
      alert("Selecione um cliente e informe o produto.");
      return;
    }

    if (!Number.isInteger(quantidade) || quantidade < 1) {
      alert("A quantidade deve ser um número inteiro maior que zero.");
      return;
    }

    if (enviandoFoto) {
      return;
    }

    setSalvandoEncomenda(true);

    try {
      const urlFoto = await obterFotoUrl();

      await criarEncomenda(
        clienteId,
        produto,
        personagem,
        tamanho,
        quantidade,
        urlFoto,
        observacoes.trim(),
        dataSolicitacao
      );

      alert(
        "Encomenda salva com sucesso!"
      );

      setClienteId("");
      setProduto("");
      setPersonagem("");
      setTamanho("");
      setQuantidade(1);
      setObservacoes("");
      setDataSolicitacao("");
      setArquivo(null);
      setFotoUrl("");

      if (arquivoInputRef.current) {
        arquivoInputRef.current.value = "";
      }

      await carregarEncomendas();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Erro ao salvar encomenda"
      );
    } finally {
      setSalvandoEncomenda(false);
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

  async function excluirFoto(encomenda: {
    id: string;
    foto_url: string | null;
    produto: string;
  }) {
    if (!encomenda.foto_url) {
      alert("Esta encomenda não possui foto.");
      return;
    }

    const confirmar = window.confirm(
      `Deseja apagar permanentemente a foto da encomenda "${encomenda.produto}"?`
    );

    if (!confirmar) {
      return;
    }

    setRemovendoFotoId(encomenda.id);

    try {
      await excluirImagem(encomenda.foto_url);
      await removerFotoEncomenda(encomenda.id);
      await carregarEncomendas();
      alert("Foto excluída com sucesso.");
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a foto."
      );
    } finally {
      setRemovendoFotoId(null);
    }
  }

  async function enviarFoto() {
    if (!arquivo) {
      alert("Selecione uma foto.");
      return;
    }

    setEnviandoFoto(true);

    try {
      await obterFotoUrl();

      alert(
        "Foto enviada com sucesso!"
      );
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Erro ao enviar foto."
      );
    } finally {
      setEnviandoFoto(false);
    }
  }

  async function obterFotoUrl() {
    if (!arquivo) {
      return undefined;
    }

    if (fotoUrl) {
      return fotoUrl;
    }

    const url = await uploadImagem(arquivo);
    setFotoUrl(url);
    return url;
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
          required
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
          required
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
          step="1"
          required
          className="border rounded p-3 w-full mb-3"
          value={quantidade}
          onChange={(e) =>
            setQuantidade(
              Number(e.target.value)
            )
          }
        />

        <label
          htmlFor="data-solicitacao"
          className="mb-1 block font-medium text-slate-700"
        >
          Data da solicitação
        </label>
        <input
          id="data-solicitacao"
          type="date"
          required
          className="border rounded p-3 w-full mb-3"
          value={dataSolicitacao}
          onChange={(e) => setDataSolicitacao(e.target.value)}
        />

        <label
          htmlFor="observacoes-encomenda"
          className="mb-1 block font-medium text-slate-700"
        >
          Observações da encomenda
        </label>
        <textarea
          id="observacoes-encomenda"
          className="border rounded p-3 w-full mb-3"
          placeholder="Observações ou detalhes solicitados pelo cliente"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
        />

        <div className="mb-4 rounded-xl border border-dashed border-sky-300 bg-sky-50 p-4">
          <label
            htmlFor="foto-encomenda"
            className="block font-semibold text-slate-800"
          >
            Foto de referência (opcional)
          </label>
          <p
            id="instrucoes-foto"
            className="mt-1 text-sm text-slate-600"
          >
            Escolha uma imagem de até 5 MB. Ela será enviada ao salvar a encomenda.
          </p>
          <input
            id="foto-encomenda"
            type="file"
            accept="image/*"
            aria-describedby="instrucoes-foto"
            ref={arquivoInputRef}
            disabled={salvandoEncomenda || enviandoFoto}
            className="mt-3 block w-full cursor-pointer text-sm text-slate-600 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:font-semibold file:text-sky-800 hover:file:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
            onChange={(e) => {
              setArquivo(e.target.files?.[0] || null);
              setFotoUrl("");
            }}
          />
          <p className="mt-2 text-sm text-slate-600">
            {arquivo
              ? `Selecionada: ${arquivo.name}`
              : "Nenhuma imagem selecionada."}
          </p>

          <button
            type="button"
            onClick={enviarFoto}
            disabled={!arquivo || salvandoEncomenda || enviandoFoto}
            className="mt-3 rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {enviandoFoto ? "Enviando foto..." : "Enviar foto agora"}
          </button>

          {fotoUrl && (
            <img
              src={fotoUrl}
              alt="Prévia da foto da encomenda"
              className="mt-3 w-40 rounded-lg"
            />
          )}
        </div>

        <button
          onClick={salvarEncomenda}
          disabled={salvandoEncomenda || enviandoFoto}
          className="bg-sky-300 px-5 py-3 rounded-xl font-semibold"
        >
          {salvandoEncomenda ? "Salvando encomenda..." : "Salvar Encomenda"}
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

            {encomenda.foto_url && (
              <div className="my-3 flex flex-wrap items-center gap-3">
                <img
                  src={encomenda.foto_url}
                  alt={encomenda.produto}
                  className="w-40 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() =>
                    excluirFoto({
                      id: encomenda.id,
                      foto_url: encomenda.foto_url,
                      produto: encomenda.produto,
                    })
                  }
                  disabled={removendoFotoId === encomenda.id}
                  className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {removendoFotoId === encomenda.id
                    ? "Excluindo foto..."
                    : "Excluir foto"}
                </button>
              </div>
            )}

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

            <p>
              📅 Solicitação:{" "}
              {encomenda.data_solicitacao
                ? new Date(
                    `${encomenda.data_solicitacao}T00:00:00`
                  ).toLocaleDateString("pt-BR")
                : "Não informada"}
            </p>

            {encomenda.observacoes && (
              <p className="whitespace-pre-wrap">
                📝 Observações: {encomenda.observacoes}
              </p>
            )}

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