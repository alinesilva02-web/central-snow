import { Suspense } from "react";
import "./globals.css";
import AuthShell from "../components/AuthShell";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen">
        <Suspense fallback={<main className="p-8">Carregando...</main>}>
          <AuthShell>{children}</AuthShell>
        </Suspense>
      </body>
    </html>
  );
}