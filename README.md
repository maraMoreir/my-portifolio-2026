# Portfolio / Blog <span title="EmDesenvolvimento"><img height="32" src="https://img.shields.io/badge/-EM%20DESENVOLVIMENTO-brightgreen"/></span>

Portfólio profissional moderno e escalável, focado em engenharia de software, arquitetura e integrações corporativas. Construído com React, TypeScript e Clean Architecture.

## 🚀 Stack Tecnológica

- **React.js** - Biblioteca UI com componentes reutilizáveis
- **TypeScript** (strict mode) - Tipagem forte e segurança
- **Vite** - Build tool moderna e rápida
- **Styled-components** - CSS-in-JS com tematização
- **Framer Motion** - Animações fluidas e performáticas
- **Three.js** - Elementos 3D leves e interativos
- **React Router** - Navegação e rotas protegidas

## 🏗️ Arquitetura

O projeto segue princípios de Clean Architecture com separação clara de responsabilidades:

```
src/
 ├── app/           # Configuração da aplicação
 ├── features/      # Features organizadas por domínio
 ├── shared/        # Componentes e utilitários compartilhados
 ├── entities/      # Modelos de domínio
 ├── infrastructure/# Serviços e integrações externas
 └── theme/         # Design tokens e temas
```

## 🔐 Segurança & Autenticação

Infraestrutura preparada para:
- Single Sign-On (SSO)
- OAuth2 / OpenID Connect
- JWT handling
- Rotas protegidas
- Session management

## 🎨 Design System

- Dark mode first
- Paleta space-tech minimalista
- Gradientes neon controlados
- Glassmorphism leve
- Alto contraste e acessibilidade

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🧪 Desenvolvimento

```bash
# Lint
npm run lint

# Type checking
npm run build
```

## 🌐 Seções

1. **Hero** - Apresentação profissional com elemento 3D
2. **Sobre** - Especialidades e áreas de interesse
3. **Tecnologias** - Stack completo organizado por categoria
4. **Engenharia** - Princípios de arquitetura e performance
5. **Novidades** - Blog técnico baseado em Markdown

## 📝 Adicionando Posts ao Blog

Os posts são gerenciados em `src/infrastructure/services/blogService.ts`. Para adicionar novos posts, edite o array `mockPosts` com:

- título
- data
- tags
- tempo de leitura
- slug
- excerpt
- conteúdo (suporta Markdown)

## ♿ Acessibilidade

- Navegação por teclado
- Skip links
- ARIA labels
- Alto contraste
- Semântica HTML correta

## 🚀 Performance

- Code splitting automático
- Lazy loading de componentes pesados
- Three.js carregado sob demanda
- Otimização de bundle
- Suspense boundaries

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.
