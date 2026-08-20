<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/gamepad-2.svg" alt="Logo" width="100"/>
  <h1>🎮 Backlog de Jogos</h1>
  <p><em>Sua coleção de games gerenciada de forma épica, rápida e elegante.</em></p>

  [![React](https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5-purple.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
  [![Fastify](https://img.shields.io/badge/Fastify-5-black.svg?style=for-the-badge&logo=fastify)](https://fastify.io/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-1B222D.svg?style=for-the-badge&logo=prisma)](https://prisma.io/)
</div>

<br>

O **Backlog de Jogos** é uma aplicação Fullstack robusta e instalável (PWA) criada para ajudar os jogadores a gerenciarem suas listas de títulos. Muito mais que uma simples tabela, o aplicativo permite organizar sua estante, exibir capas oficiais conectadas via API RAWG, acompanhar estatísticas dinâmicas no Dashboard e alternar de forma nativa entre Modo Claro e Escuro.

---

## ✨ Features Principais

* 🔒 **Autenticação Segura (Multi-tenant):** Contas de usuários protegidas por JWT. Seus jogos são separados dos jogos de outros usuários.
* 🌓 **Modo Claro / Escuro Automático:** Transição suave e nativa entre temas, memorizando sua preferência.
* 📊 **Dashboard Analítico:** Gráficos interativos renderizados via `Recharts` que contabilizam sua evolução e mostram seus gêneros preferidos.
* 📱 **PWA (Instalável):** O aplicativo pode ser instalado no Desktop (Windows/Mac) e no Smartphone (Android/iOS) como um app nativo.
* 🔍 **Filtros Avançados & Ordenação:** Navegue por sua estante filtrando por Plataforma, Status (Jogando, Zerado, etc), ou ordenando por Nota e Horas Jogadas instantaneamente na memória.
* 🖼️ **Integração com RAWG API:** Autocompletar mágico de capas, nomes de jogos, gêneros e notas do Metacritic durante o cadastro do jogo.

---

## 🛠️ Tecnologias Utilizadas

### Frontend 🎨
- **React (TypeScript)** + **Vite** para máxima velocidade.
- **TailwindCSS (v4)** e **Shadcn UI** para um design *glassmorphism* moderno.
- **TanStack Query (React Query)** para cacheamento avançado de requisições.
- **Recharts** para construção de gráficos dinâmicos.
- **Lucide React** para ícones belíssimos.

### Backend ⚙️
- **Node.js** + **Fastify** garantindo alta performance de roteamento.
- **Zod** + **Fastify Type Provider** para blindar todas as validações de dados ponta a ponta.
- **Prisma ORM** + **MySQL** no banco de dados.
- **BcryptJS** & **Fastify-JWT** para criptografia e validação de tokens seguros.

---

## 🚀 Como Realizar o Deploy

Este projeto está configurado para ser hospedado utilizando as seguintes plataformas:
- **Frontend e Backend**: Vercel
- **Banco de Dados**: Supabase (PostgreSQL)
- **Repositório**: GitHub

### 1. Banco de Dados (Supabase)
1. Crie uma conta no [Supabase](https://supabase.com/) e crie um novo projeto.
2. Nas configurações do projeto, vá em **Database** e copie a "Connection string" (URI) do PostgreSQL.
3. Certifique-se de que a senha está correta na URI copiada. O formato será algo como: 
   `postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres`

### 2. Backend (Vercel)
1. Crie uma conta na [Vercel](https://vercel.com/) e conecte seu GitHub.
2. Crie um novo projeto e conecte o repositório do seu projeto (pasta `API`).
3. Na seção de **Environment Variables**, adicione as seguintes variáveis:
   - `DATABASE_URL`: Insira a URI do Supabase que você copiou no passo anterior.
   - `JWT_SECRET`: Insira uma string aleatória (ex: `sua_chave_super_secreta_aqui`).
   - `FRONTEND_URL`: Insira a URL do seu frontend.
4. Após o deploy, a Vercel vai gerar a URL da sua API (ex: `https://seu-backend.vercel.app`).
5. **Atenção:** É preciso rodar as migrações do banco de dados. Localmente, com a `DATABASE_URL` configurada apontando para o Supabase, rode:
   `npx prisma migrate deploy`

### 3. Frontend (Vercel)
1. Na [Vercel](https://vercel.com/), crie um novo projeto e importe o repositório novamente, mas agora focado no frontend.
2. Configure o projeto:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Expanda **Environment Variables** e adicione:
   - `VITE_API_URL`: Insira a URL da API gerada no passo anterior (ex: `https://seu-backend.vercel.app`).
4. O arquivo `vercel.json` já está incluso no repositório para evitar o erro `404 Not Found` em rotas ao recarregar a página.

---

## 📱 Dica de PWA
Abra a URL do frontend no seu navegador (Edge ou Chrome) e clique no ícone "Instalar Aplicativo" no canto direito da barra de endereços para ter o **Backlog de Jogos** diretamente na sua Área de Trabalho!

---
<div align="center">
Desenvolvido como Projeto Trainee. Divirta-se organizando o seu backlog! 🕹️
</div>