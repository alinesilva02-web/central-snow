import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>

        <nav
          style={{
            padding: "20px",
            borderBottom: "1px solid #ddd",
            display: "flex",
            gap: "20px",
          }}
        >
          <Link href="/">
            ❄️ Central Snow
          </Link>

          <Link href="/clientes">
            👥 Clientes
          </Link>

          <Link href="/encomendas">
            📦 Encomendas
          </Link>

                    <Link href="/encomendas">
            ❄️ Dashboard
          </Link>
        </nav>
        

        {children}

      </body>
    </html>
  );
}