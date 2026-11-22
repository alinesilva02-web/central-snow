"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Package,
  Snowflake,
  Users,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";

type Acesso = {
  carregando: boolean;
  usuario: Session["user"] | null;
  administrador: boolean;
  erro: string | null;
};

const acessoInicial: Acesso = {
  carregando: true,
  usuario: null,
  administrador: false,
  erro: null,
};

export default function AuthShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [acesso, setAcesso] = useState(acessoInicial);
  const rotaPublica = ["/", "/login", "/cadastro"].includes(pathname);
  const rotaAdministrador =
    pathname === "/dashboard" ||
    pathname === "/clientes" ||
    pathname.startsWith("/clientes/") ||
    pathname === "/encomendas";

  useEffect(() => {
    let ativo = true;

    async function carregarAcesso(session: Session | null) {
      if (!session) {
        if (ativo) {
          setAcesso({
            carregando: false,
            usuario: null,
            administrador: false,
            erro: null,
          });
        }
        return;
      }

      if (ativo) {
        setAcesso({
          carregando: true,
          usuario: session.user,
          administrador: false,
          erro: null,
        });
      }

      const { data, error } = await supabase.rpc("is_admin");

      if (!ativo) {
        return;
      }

      setAcesso({
        carregando: false,
        usuario: session.user,
        administrador: data === true,
        erro: error?.message || null,
      });
    }

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        if (ativo) {
          setAcesso({
            carregando: false,
            usuario: null,
            administrador: false,
            erro: error.message,
          });
        }
        return;
      }

      void carregarAcesso(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => {
        void carregarAcesso(session);
      }, 0);
    });

    return () => {
      ativo = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (acesso.carregando || acesso.erro) {
      return;
    }

    if (rotaPublica) {
      if (acesso.usuario) {
        router.replace(acesso.administrador ? "/dashboard" : "/portal");
      }
      return;
    }

    if (!acesso.usuario) {
      router.replace("/login");
      return;
    }

    if (rotaAdministrador && !acesso.administrador) {
      router.replace("/portal");
      return;
    }

    if (pathname === "/portal" && acesso.administrador) {
      router.replace("/dashboard");
    }
  }, [acesso, pathname, router, rotaAdministrador, rotaPublica]);

  async function sair() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
      return;
    }

    router.replace("/login");
  }

  const cabecalho = (
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

        {acesso.usuario && acesso.administrador ? (
          <div className="flex flex-wrap items-center gap-1">
            <Link href="/clientes" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-sky-50 hover:text-sky-800">
              <Users aria-hidden="true" size={17} />
              Clientes
            </Link>
            <Link href="/encomendas" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-sky-50 hover:text-sky-800">
              <Package aria-hidden="true" size={17} />
              Encomendas
            </Link>
            <Link href="/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-sky-50 hover:text-sky-800">
              <LayoutDashboard aria-hidden="true" size={17} />
              Dashboard
            </Link>
            <button type="button" onClick={sair} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-800">
              <LogOut aria-hidden="true" size={17} />
              Sair
            </button>
          </div>
        ) : acesso.usuario ? (
          <div className="flex items-center gap-2">
            <Link href="/portal" className="rounded-lg px-3 py-2 text-sm font-medium text-sky-800 hover:bg-sky-50">
              Minhas encomendas
            </Link>
            <button type="button" onClick={sair} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-800">
              <LogOut aria-hidden="true" size={17} />
              Sair
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-sky-50">
              Entrar
            </Link>
            <Link href="/cadastro" className="rounded-lg bg-sky-700 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-800">
              Cadastro do cliente
            </Link>
          </div>
        )}
      </nav>
    </header>
  );

  if (rotaPublica) {
    return (
      <>
        {cabecalho}
        {children}
      </>
    );
  }

  if (acesso.carregando) {
    return (
      <>
        {cabecalho}
        <main className="mx-auto max-w-3xl p-8 text-slate-600">
          Verificando acesso...
        </main>
      </>
    );
  }

  if (acesso.erro) {
    return (
      <>
        {cabecalho}
        <main className="mx-auto max-w-3xl p-8">
          <p role="alert" className="text-rose-800">
            Não foi possível verificar seu acesso. Confirme se a migração de
            autenticação foi aplicada no Supabase.
          </p>
        </main>
      </>
    );
  }

  if (
    !acesso.usuario ||
    (rotaAdministrador && !acesso.administrador) ||
    (pathname === "/portal" && acesso.administrador)
  ) {
    return null;
  }

  return (
    <>
      {cabecalho}
      {children}
    </>
  );
}
