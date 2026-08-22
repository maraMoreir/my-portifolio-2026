# Portfolio / Blog <span title="EmDesenvolvimento"><img height="32" src="https://img.shields.io/badge/-EM%20DESENVOLVIMENTO-brightgreen"/></span>

Portfólio profissional moderno e escalável, focado em engenharia de software, arquitetura e integrações corporativas. Frontend em React/TypeScript desacoplado de um backend em ASP.NET Core (.NET 10).

## 🚀 Stack

**Frontend** (`/`)
- React 19 + TypeScript (strict) + Vite
- Styled-components (tematização) + Framer Motion (animações)
- React Router — landing pública, post individual e área administrativa protegida
- Vitest + Testing Library

**Backend** (`/backend`) — veja [backend/README.md](backend/README.md)
- ASP.NET Core (.NET 10), EF Core + PostgreSQL
- ASP.NET Core Identity + JWT (access token) + refresh token rotativo em cookie HttpOnly
- xUnit (unitários + integração via `WebApplicationFactory`)

## 🏗️ Arquitetura

```
src/
 ├── app/            # App.tsx: providers, roteamento
 ├── pages/          # Home, post individual, área admin (login/dashboard/editor)
 ├── features/       # UI por domínio (about, auth, blog, navigation)
 ├── services/       # Camada HTTP única — nenhum componente chama fetch diretamente
 ├── entities/       # Tipos de domínio compartilhados (Post, User)
 ├── shared/         # Componentes, animações e utilitários reaproveitáveis
 ├── config/         # Acesso tipado a variáveis de ambiente
 └── theme/          # Design tokens
```

Fluxo de dados: `Componente → Hook de feature → Service → HTTP client → API .NET`.

## 🔐 Autenticação & administração

Um único usuário administrador. Login por e-mail/senha via ASP.NET Core
Identity; sessão mantida por um access token JWT de curta duração (guardado
em memória, nunca `localStorage`) renovado silenciosamente por um refresh
token em cookie `HttpOnly`. Autorização (`/admin/*`) é decidida no
**backend** — o guard de rota no frontend é só UX. Detalhes em
[backend/README.md](backend/README.md#autenticação-e-autorização).

## 📝 Blog: mock vs. API real

O blog público funciona hoje sobre dados mockados (`src/services/blogService.ts`)
e continua funcionando assim **até que `VITE_API_BASE_URL` seja configurada**
(ver `.env.example`) — nesse momento `src/services/postsService.ts` passa a
usar a API .NET automaticamente, sem tocar em nenhum componente. A área
administrativa (criar/editar/publicar posts) sempre fala com a API real —
não existe um "modo mock" para ela, já que não há nada para editar sem
backend.

## 📦 Instalação e desenvolvimento

```bash
# Frontend
npm install
npm run dev              # http://localhost:5173
npm run build             # type-check + build de produção
npm run lint
npm run test               # Vitest
npm run test:watch

# Backend (veja backend/README.md para configuração de secrets/banco)
cd backend
dotnet run --project src/Portfolio.Api --launch-profile https
dotnet test
```

## 🌐 Seções

1. **Hero** — apresentação profissional
2. **Tecnologias** — stack completo por categoria
3. **Engenharia** — princípios de arquitetura e performance
4. **Novidades** — listagem de posts + página de post individual (Markdown)
5. **Admin** (`/admin`, protegido) — gerenciamento de posts

## ♿ Acessibilidade

- Navegação por teclado, skip links, ARIA labels, alto contraste, semântica HTML correta

## 🚀 Performance

- Code splitting por rota (post individual e área admin são carregados sob demanda, mesmo padrão usado no elemento 3D do Hero)
- Suspense boundaries

## 🔒 Segurança

- Headers básicos (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`) tanto no frontend (`vercel.json`) quanto na API
- Nenhum segredo no código-fonte — variáveis de ambiente/`.env.example` no frontend, `dotnet user-secrets`/variáveis de ambiente no backend
- Detalhes de autenticação, CORS e rate limiting em [backend/README.md](backend/README.md)

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.
