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

## 🚀 Como Rodar o Projeto (Localmente)

### 📋 Pré-requisitos
- Node.js (v18+)
- MySQL Server rodando localmente na sua máquina.
- Git instalado.

### 1. Clonar o Repositório
```bash
git clone https://github.com/Kamay821/Backlog-de-Jogos.git
cd Backlog-de-Jogos
```

### 2. Configurar o Backend (API)
```bash
cd API
npm install
```
* **Banco de Dados:** Crie um arquivo `.env` na pasta `API` contendo:
  ```env
  DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/backlog_db"
  JWT_SECRET="sua_chave_super_secreta"
  ```
* **Migrações:** Rode a migração para criar as tabelas no MySQL.
  ```bash
  npx prisma migrate dev --name init
  ```
* **Iniciar o Servidor API:**
  ```bash
  npm run dev
  ```
  O servidor estará escutando na porta `3333`.

### 3. Configurar o Frontend
Abra um novo terminal e navegue para a pasta `frontend`.
```bash
cd frontend
npm install
```
* **Iniciar o Vite Server:**
  ```bash
  npm run dev
  ```
  O frontend estará disponível em `http://localhost:5173`. 

---

## 📱 Dica de PWA
Abra a URL do frontend no seu navegador (Edge ou Chrome) e clique no ícone "Instalar Aplicativo" no canto direito da barra de endereços para ter o **Backlog de Jogos** diretamente na sua Área de Trabalho!

---
<div align="center">
Desenvolvido como Projeto Trainee. Divirta-se organizando o seu backlog! 🕹️
</div>