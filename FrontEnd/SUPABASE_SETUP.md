# Configurar login e cadastro

O DraftUp usa o Supabase Auth para registrar contas, armazenar credenciais com segurança e manter sessões. Não crie uma tabela para senhas: usuários existentes e novos ficam em **Authentication > Users** no painel Supabase. `profiles.sql` cria uma tabela opcional `public.profiles` para nomes e outros dados de perfil.

1. Abra ou crie seu projeto em [supabase.com/dashboard](https://supabase.com/dashboard).
2. Em **Project Settings > API**, copie o **Project URL** e a chave pública **anon** (ou **publishable**).
3. Copie `.env.example` para `.env.local` na pasta `FrontEnd` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
4. Reinicie o Vite depois de alterar variáveis de ambiente. Não use `SUPABASE_KEY`/service role no frontend.
5. Em **Authentication > URL Configuration**, defina o Site URL local como `http://localhost:5173` durante desenvolvimento e adicione `http://localhost:5173/**` às Redirect URLs. Em produção, use o domínio do site.
6. Em **Authentication > Providers > Email**, mantenha Email habilitado. Com confirmação de e-mail ligada, novos usuários precisam confirmar a mensagem antes de entrar; ajuste o SMTP para produção para garantir entrega.
7. Opcional: abra **SQL Editor**, cole e execute `supabase/profiles.sql` para criar a tabela de perfis com políticas que limitam cada conta aos próprios dados.

Os botões de envio levam à tela de login para visitantes e à página de upload para usuários autenticados. A rota `/upload` também verifica a sessão, mesmo se aberta diretamente.
