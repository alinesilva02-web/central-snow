import { supabase } from "./supabase";

export type Cliente = {
  id: string;
  nome: string;
  whatsapp: string;
  tiktok: string | null;
  observacoes: string | null;
  created_at?: string;
};

export async function criarCliente(
  nome: string,
  whatsapp: string,
  tiktok: string,
  observacoes: string
) {
  const { data, error } = await supabase
    .from("clientes")
    .insert([
      {
        nome,
        whatsapp,
        tiktok,
        observacoes,
      },
    ]);

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

export async function listarClientes() {
  const { data, error } = await supabase
    .from("clientes")
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

export async function buscarCliente(
  id: string
) {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}


export async function contarClientes() {
  const { count, error } = await supabase
    .from("clientes")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (error) {
    console.error(error);
    throw error;
  }

  return count || 0;
}

export async function atualizarCliente(
  id: string,
  nome: string,
  whatsapp: string,
  tiktok: string,
  observacoes: string
) {
  const { data, error } = await supabase
    .from("clientes")
    .update({
      nome,
      whatsapp,
      tiktok,
      observacoes,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

export async function excluirCliente(id: string) {
  const { data: encomendas, error: erroEncomendas } = await supabase
    .from("encomendas")
    .select("id")
    .eq("cliente_id", id);

  if (erroEncomendas) {
    console.error(erroEncomendas);
    throw erroEncomendas;
  }

  if (encomendas && encomendas.length > 0) {
    const { error: erroExcluirEncomendas } = await supabase
      .from("encomendas")
      .delete()
      .eq("cliente_id", id);

    if (erroExcluirEncomendas) {
      console.error(erroExcluirEncomendas);
      throw erroExcluirEncomendas;
    }
  }

  const { data, error } = await supabase
    .from("clientes")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    console.error(error);
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error(
      "Não foi possível excluir o cliente. Verifique as permissões da base de dados."
    );
  }
}
