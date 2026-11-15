import "./globals.css";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Snowflake,
  Users,
} from "lucide-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen">
        <header className="sticky top-0 z-10 border-b border-sky-100 bg-white/95 shadow-sm backdrop-blur">
          <nav
            aria-label="Navegação principal"
            className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
          >
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-slate-900 transition hover:text-sky-700"
            >
              <span className="rounded-xl bg-sky-100 p-2 text-sky-700">
                <Snowflake aria-hidden="true" size={20} />
              </span>
              <span>Central Snow</span>
            </Link>

            <div className="flex flex-wrap items-center gap-1">
              <Link
                href="/clientes"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
              >
                <Users aria-hidden="true" size={17} />
                Clientes
              </Link>
              <Link
                href="/encomendas"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
              >
                <Package aria-hidden="true" size={17} />
                Encomendas
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
              >
                <LayoutDashboard aria-hidden="true" size={17} />
                Dashboard
              </Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}