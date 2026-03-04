# PortRF Starter Kit

Monorepo production-ready para plataforma **Portfolio Pessoal + Dashboard Admin**, com Next.js (web/admin), NestJS (API), Prisma, Postgres e Docker Compose. Inclui upload local com volume persistente, filtros via query string e infra preparada para Traefik/HTTPS.

## Stack
- Web: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui base libs + react-hook-form + zod
- API: NestJS + Prisma + JWT (cookie httpOnly) + Multer (upload local)
- DB: PostgreSQL (Docker)
- Infra: Docker Compose + Traefik (labels prontos para HTTPS)

## Como correr (dev)
1. Copiar `.env.example` para `.env` e ajustar variáveis.
2. Subir stack:
```
docker compose up --build
```
3. Aplicar migrações:
```
docker compose exec api npm run prisma:migrate
```
4. Aceder:
- Web: `http://localhost:3000`
- API: `http://localhost:3001`
- Traefik dashboard: `http://localhost:8080`

## Admin seed automático
O seed cria 1 utilizador admin se não existir, usando:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Esse seed corre no bootstrap da API e também está disponível via:
```
docker compose exec api npm run prisma:seed
```

## Login Admin
- URL: `http://localhost:3000/login`
- Credenciais: `ADMIN_EMAIL` / `ADMIN_PASSWORD`

## Query String do Projects
Exemplos:
- `/projects`
- `/projects?tab=video`
- `/projects?tab=dev&tags=nextjs,prisma&year=2026&search=dashboard&featured=true&sort=newest&page=1&limit=12`

## Endpoints principais
Público:
- `GET /content`
- `GET /content/:slug`
- `GET /tags`
- `GET /settings`
- `GET /uploads/*`

Admin (protegido):
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /content`
- `PATCH /content/:id`
- `DELETE /content/:id`
- `GET /content/admin/list`
- `GET /content/admin/:id`
- `POST /media/upload`
- `DELETE /media/:id`
- `POST /tags`
- `PATCH /tags/:id`
- `DELETE /tags/:id`
- `PATCH /settings`

## Upload local
- Storage: `/app/uploads` dentro do container API
- Pastas: `/uploads/images`, `/uploads/videos`, `/uploads/files`, `/uploads/covers`
- Volume persistente: `uploads_data:/app/uploads`
- Path guardado no DB: `/uploads/images/uuid.ext`

## Estrutura do monorepo
```
apps/
  web/        # Next.js (público + dashboard)
  api/        # NestJS + Prisma
```

## Variáveis de ambiente (resumo)
API:
- `DATABASE_URL`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `COOKIE_DOMAIN` (opcional)
- `CORS_ORIGIN`
- `UPLOAD_DIR`

Web:
- `API_BASE_URL` (server-side)
- `NEXT_PUBLIC_API_BASE_URL` (client-side)

Traefik:
- `TRAEFIK_ACME_EMAIL`

## Migrações Prisma
- Gerar client:
```
docker compose exec api npm run prisma:generate
```
- Aplicar migração inicial:
```
docker compose exec api npm run prisma:migrate
```

## Notas
- Público só lista `status=PUBLISHED`.
- Admin tem acesso a `DRAFT/PUBLISHED/ARCHIVED`.
- Slug é auto-gerado e pode ser editado.
- Types MVP implementados: DEV, VIDEO, ARTICLE.
