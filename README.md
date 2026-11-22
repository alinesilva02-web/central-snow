This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Acesso de clientes e administrador

1. Aplique os arquivos de `supabase/migrations/` no SQL Editor do Supabase, em ordem de nome. A migração `20261121211500_auth_clientes_historico.sql` ativa as regras de acesso: clientes só consultam suas próprias encomendas; o painel fica reservado ao administrador.
2. Crie a conta do administrador em **Supabase → Authentication → Users**.
3. No SQL Editor, vincule essa conta como administradora, substituindo pelo e-mail criado:

   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'EMAIL_DO_ADMINISTRADOR'
   on conflict do nothing;
   ```

4. Configure em **Authentication → URL Configuration** o domínio publicado e os endereços de redirecionamento para `/portal` (incluindo `http://localhost:3000/portal` para desenvolvimento).
5. Os clientes podem criar conta em `/cadastro` com nome, WhatsApp, e-mail e senha. O e-mail é usado para entrar; nome e WhatsApp identificam o cadastro. O Supabase pode exigir confirmação do e-mail conforme a configuração de autenticação.

Novos cadastros de clientes são associados automaticamente à conta. Clientes já existentes não são vinculados automaticamente a novas contas; confirme a identidade antes de associar uma conta a um cadastro antigo.
