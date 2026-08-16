# Portfolio API (.NET 10)

Backend do blog do portfólio: autenticação de um único administrador e
CRUD/publicação de posts. Feito para ser consumido pelo frontend React
separadamente (SPA + API), nunca para acoplar os dois.

## Arquitetura

```
src/
 ├── Portfolio.Domain          # Entidades (Post, Tag, RefreshToken), zero dependências externas
 ├── Portfolio.Application     # Casos de uso (PostService, AuthService), DTOs, interfaces (ports)
 ├── Portfolio.Infrastructure  # EF Core, ASP.NET Core Identity, JWT, repositórios (implementa os ports)
 └── Portfolio.Api             # Controllers, Program.cs, middlewares, contratos HTTP
tests/
 ├── Portfolio.UnitTests        # Domain + Application, sem banco (repositórios mockados)
 └── Portfolio.IntegrationTests # HTTP real via WebApplicationFactory + SQLite em memória
```

Regra de dependência: `Api`/`Infrastructure` → `Application` → `Domain`. O
`Domain` não conhece EF Core, ASP.NET ou qualquer framework. O `Application`
não conhece EF Core nem Identity — fala só com as interfaces
`IPostRepository`/`IPasswordAuthenticator`/`ITokenService`/`IRefreshTokenRepository`,
implementadas em `Infrastructure`.

## Autenticação e autorização

- **ASP.NET Core Identity** (só o núcleo, sem UI) cuida do hash de senha,
  lockout por tentativas inválidas e roles — preparado para múltiplos
  usuários/roles no futuro, mesmo com um único admin hoje.
- **Access token JWT de curta duração (15 min)**: o frontend guarda em
  memória (nunca `localStorage`), então uma vulnerabilidade de XSS não
  consegue lê-lo de um storage persistente.
- **Refresh token opaco, rotativo, em cookie `HttpOnly; Secure; SameSite=None`**,
  com escopo `Path=/api/auth`: só o navegador o envia, só para esse
  endpoint, e só sobre HTTPS. Cada uso revoga o token anterior (rotação) —
  um cookie roubado e reutilizado é detectado (a segunda tentativa falha).
  Apenas o hash SHA-256 fica no banco.
- **Roles + policy** (`AdminOnly`): endpoints administrativos exigem
  `[Authorize(Policy = "AdminOnly")]`. Sem token → 401. Com token válido mas
  sem a role `Admin` → 403. A autorização real acontece aqui, no backend —
  o guard de rota no frontend é só UX.
- **Rate limiting** no login, particionado por IP (não é um balde global —
  isso evitaria que um único cliente barulhento derrubasse o login de todo
  mundo).

## Configuração local (obrigatório antes de rodar)

Nada de segredo fica em `appsettings*.json`. Configure via
`dotnet user-secrets` (rodando dentro de `src/Portfolio.Api`):

```bash
cd src/Portfolio.Api
dotnet user-secrets init   # já feito neste repo, mas idempotente

dotnet user-secrets set "ConnectionStrings:Default" "Server=(localdb)\MSSQLLocalDB;Database=PortfolioDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
dotnet user-secrets set "Jwt:SigningKey" "<gere uma chave aleatória de 32+ chars, ex.: openssl rand -base64 48>"
dotnet user-secrets set "AdminUser:Email" "seu-email@exemplo.com"
dotnet user-secrets set "AdminUser:Password" "<senha forte, só usada na primeira execução>"
dotnet user-secrets set "AdminUser:Name" "Seu Nome"
```

O usuário admin é criado automaticamente na primeira vez que a API sobe (se
nenhum admin existir ainda e essas variáveis estiverem configuradas) — troque
a senha por algo só seu depois do primeiro login; ela não é reutilizada nem
lida de novo depois que o admin já existe.

Em produção, as mesmas chaves vêm de variáveis de ambiente
(`ConnectionStrings__Default`, `Jwt__SigningKey`, `AdminUser__Email`,
`AdminUser__Password`) — nunca do código-fonte.

## Rodando localmente

```bash
dotnet dev-certs https --trust   # uma vez, para o cookie Secure funcionar em dev
dotnet ef database update --project src/Portfolio.Infrastructure --startup-project src/Portfolio.Api
dotnet run --project src/Portfolio.Api --launch-profile https
```

Migrations rodam automaticamente ao subir em `Development`; em produção, o
deploy roda `dotnet ef database update` explicitamente como uma etapa
própria (nunca automático a cada start).

## Testes

```bash
dotnet test
```

37 testes: 25 unitários (regras de domínio, `PostService`/`AuthService` com
repositórios mockados) + 12 de integração (HTTP real, banco SQLite em
memória) cobrindo login, 401/403, rotação/replay de refresh token, e o
ciclo completo de um post (criar → publicar → aparecer no público →
despublicar → excluir).

## Modelo de dados

- `Post`: `Title`, `Slug` (único), `Excerpt`, `ContentMarkdown`, `Status`
  (`Draft`/`Published`), `PublishedAt`, `CreatedAt`/`UpdatedAt`, `AuthorId`.
  Índice único em `Slug`; índice composto em `(Status, PublishedAt)` para a
  listagem pública.
- `Tag`: entidade própria (não uma coluna CSV), N:N implícito com `Post` via
  tabela `PostTags` — mantém o filtro por tag que já existe no frontend
  como uma consulta indexada normal.
- `RefreshToken`: só o hash do token, `ExpiresAt`, `RevokedAt`.
