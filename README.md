<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/gamepad-2.svg" alt="Logo" width="80"/>
  <h1>Backlog de Jogos</h1>
  <p>Gerencie sua coleção de jogos de forma rápida e elegante.</p>

  [![React](https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5-purple.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
  [![Fastify](https://img.shields.io/badge/Fastify-5-black.svg?style=for-the-badge&logo=fastify)](https://fastify.io/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-1B222D.svg?style=for-the-badge&logo=prisma)](https://prisma.io/)
</div>

<br>

O **Backlog de Jogos** é uma aplicação Fullstack desenvolvida para ajudar jogadores a organizar suas bibliotecas, acompanhar estatísticas de gameplay e descobrir novos títulos integrados de forma transparente à base de dados do RAWG.

---

## Principais Funcionalidades

- **Autenticação Multi-tenant**: Segurança baseada em JWT para separar a biblioteca de cada usuário.
- **Integração RAWG API**: Autocompleta capas, nomes e notas do Metacritic automaticamente durante o cadastro de jogos.
- **Dashboard Analítico**: Gráficos dinâmicos que apresentam estatísticas da sua coleção e gêneros favoritos.
- **PWA Ready**: Instalação nativa via navegador no Desktop e Mobile.
- **Filtros e Ordenação Avançados**: Buscas e ordenações rápidas em memória.
- **Modo Claro / Escuro**: Transição nativa de temas integrada à interface.

---

## Tecnologias

### Frontend
- **React** (TypeScript) construído com **Vite**
- **TailwindCSS** + **Shadcn UI** para design responsivo e acessível
- **React Query** para gerenciamento de estado e cache de requisições
- **Recharts** e **Lucide React** para componentes visuais

### Backend e Infraestrutura
- **Node.js** + **Fastify** para roteamento de alta performance
- **Zod** para validação de esquemas e tipagem estática End-to-End
- **Prisma ORM** integrado com banco de dados **PostgreSQL** (Supabase)
- **Vercel** para deploy de ambiente Serverless (Frontend e Backend)

---

## Como rodar o projeto localmente

### 1. Requisitos
- Node.js versão 20+
- Um banco de dados PostgreSQL (ex: Supabase)

### 2. Configurando o Backend (API)
```bash
cd API
npm install
```
- Crie um arquivo `.env` na pasta `API` com base no `env.example` (ou adicione as variáveis `DATABASE_URL` e `JWT_SECRET`).
- Rode as migrações do banco de dados:
```bash
npx prisma migrate dev
```
- Inicie o servidor em modo de desenvolvimento:
```bash
npm run dev
```

### 3. Configurando o Frontend
Abra um novo terminal e navegue até a pasta do frontend:
```bash
cd frontend
npm install
```
- Crie um arquivo `.env` na pasta `frontend` e adicione a variável para se comunicar com o backend local:
```env
VITE_API_URL=http://localhost:3000
```
- Inicie a interface:
```bash
npm run dev
```

---

Desenvolvido como projeto Trainee na Serra Jr. Engenharia.