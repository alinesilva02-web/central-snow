import { supabase } from "./supabase";

export async function uploadImagem(
  arquivo: File
) {
  const nomeArquivo =
    `${Date.now()}-${arquivo.name}`;

  const { error } =
    await supabase.storage
      .from("encomendas")
      .upload(
        nomeArquivo,
        arquivo
      );

  if (error) {
    throw error;
  }

  const {
    data,
  } = supabase.storage
    .from("encomendas")
    .getPublicUrl(
      nomeArquivo
    );

  return data.publicUrl;
}