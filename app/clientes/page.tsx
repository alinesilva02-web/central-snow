export default function ClientesPage() {
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
        />

        <input
          className="border rounded p-3 w-full mb-3"
          placeholder="WhatsApp"
        />

        <input
          className="border rounded p-3 w-full mb-3"
          placeholder="TikTok"
        />

        <textarea
          className="border rounded p-3 w-full mb-3"
          placeholder="Observações"
        />

        <button
          className="bg-sky-300 px-5 py-3 rounded-xl font-semibold"
        >
          Salvar Cliente
        </button>

      </div>

    </main>
  );
}