import { supabase } from "./supabase";

export async function criarEncomenda(
  cliente_id: string,
  produto: string,
  personagem: string,
  tamanho: string,
  quantidade: number
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