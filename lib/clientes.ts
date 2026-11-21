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
  const { error } = await supabase
    .from("clientes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    throw error;
  }
}
