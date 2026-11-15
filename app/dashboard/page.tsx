export default function DashboardPage() {
  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-6">
        ❄️ Dashboard
      </h1>

      <div className="grid gap-4 md:grid-cols-3">

        <div className="border rounded-xl p-6">
          🆕 Recebidos: 0
        </div>

        <div className="border rounded-xl p-6">
          🔍 Procurando: 0
        </div>

        <div className="border rounded-xl p-6">
          ✅ Encontrados: 0
        </div>

        <div className="border rounded-xl p-6">
          🚚 Aguardando Chegada: 0
        </div>

        <div className="border rounded-xl p-6">
          📦 Chegaram: 0
        </div>

        <div className="border rounded-xl p-6">
          ✔️ Finalizados: 0
        </div>

      </div>
    </main>
  );
}