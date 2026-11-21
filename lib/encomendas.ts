import { supabase } from "./supabase";

export type Encomenda = {
  id: string;
  cliente_id: string;
  produto: string;
  personagem: string | null;
  tamanho: string | null;
  quantidade: number;
  status: string | null;
  foto_url: string | null;
  created_at?: string;
};

export async function criarEncomenda(
  cliente_id: string,
  produto: string,
  personagem: string,
  tamanho: string,
  quantidade: number,
  foto_url?: string
) {
  const { data, error } = await supabase
    .from("encomendas")
    .insert([
      {
        cliente_id,
        produto,
        personagem,
        tamanho,
        quantidade,
        foto_url,
      },
    ]);

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

export async function listarEncomendas() {
    const { data, error } = await supabase
        .from("encomendas")
        .select("*")
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        console.error(error);
        throw error;
    }

    return data;
}

export async function atualizarStatus(
    id: string,
    status: string
) {
    const { error } = await supabase
        .from("encomendas")
        .update({
            status,
        })
        .eq("id", id);

    if (error) {
        console.error(error);
        throw error;
    }
}

export async function removerFotoEncomenda(id: string) {
    const { error } = await supabase
        .from("encomendas")
        .update({
            foto_url: null,
        })
        .eq("id", id);

    if (error) {
        console.error(error);
        throw error;
    }
}

export async function contarEncomendas() {
    const { count, error } = await supabase
        .from("encomendas")
        .select("*", {
            count: "exact",
            head: true,
        });

    if (error) {
        throw error;
    }

    return count || 0;
}

export async function listarEncomendasPorCliente(
    clienteId: string
) {
    const { data, error } = await supabase
        .from("encomendas")
        .select("*")
        .eq("cliente_id", clienteId)
        .order("created_at", {
            ascending: false,
        });

    if (error) {
        throw error;
    }

    return data;
}