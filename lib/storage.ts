import { supabase } from "./supabase";

const BUCKET_ENCOMENDAS = "encomendas";
const TAMANHO_MAXIMO_IMAGEM = 5 * 1024 * 1024;

export async function uploadImagem(
  arquivo: File
) {
  if (!arquivo.type.startsWith("image/")) {
    throw new Error("Selecione um arquivo de imagem.");
  }

  if (arquivo.size > TAMANHO_MAXIMO_IMAGEM) {
    throw new Error("A imagem deve ter no máximo 5 MB.");
  }

  const nomeArquivo =
    `${Date.now()}-${arquivo.name}`;

  const { error } =
    await supabase.storage
      .from(BUCKET_ENCOMENDAS)
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
    .from(BUCKET_ENCOMENDAS)
    .getPublicUrl(
      nomeArquivo
    );

  return data.publicUrl;
}

export async function excluirImagem(urlImagem: string) {
  const url = new URL(urlImagem);
  const supabaseUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);
  const prefixo = `/storage/v1/object/public/${BUCKET_ENCOMENDAS}/`;

  if (
    url.origin !== supabaseUrl.origin ||
    !url.pathname.startsWith(prefixo)
  ) {
    throw new Error("A imagem não pertence ao bucket de encomendas.");
  }

  const caminho = decodeURIComponent(
    url.pathname.slice(prefixo.length)
  );

  if (
    !caminho ||
    caminho.split("/").some((parte) => !parte || parte === "." || parte === "..")
  ) {
    throw new Error("Não foi possível identificar o arquivo da imagem.");
  }

  const { error } = await supabase.storage
    .from(BUCKET_ENCOMENDAS)
    .remove([caminho]);

  if (error) {
    console.error(error);
    throw error;
  }
}