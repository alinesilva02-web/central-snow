import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-sky-50 px-4 py-12">
      <div className="max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl sm:p-10">
        <h1 className="text-4xl font-bold text-slate-950 sm:text-5xl">
          Central Snow
        </h1>

        <p className="mt-4 text-slate-600">
          Acesse sua conta ou cadastre-se para enviar e acompanhar suas próprias encomendas.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-sky-700 px-5 py-3 font-semibold text-white hover:bg-sky-800"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="rounded-lg border border-sky-700 px-5 py-3 font-semibold text-sky-800 hover:bg-sky-50"
          >
            Cadastro do cliente
          </Link>
        </div>
      </div>
    </main>
  );
}