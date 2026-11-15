import { supabase } from "./supabase";

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