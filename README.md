# Feedback Dashboard

Admin dashboard voor het beheren van feedback uit For The People applicaties.

## Features

- 🔐 Wachtwoord-beschermde toegang
- 📊 Statistieken per type en status
- 📋 Feedback lijst met filters en zoeken
- 🔍 Detail view met screenshot en metadata
- ✅ Status beheer (nieuw → gezien → in behandeling → opgelost)
- 🎨 For The People design system

## Tech Stack

- **Framework:** Nuxt 3
- **Styling:** @for-the-people-initiative/design-system
- **Database:** Turso (libSQL)
- **Deploy:** Render (static site)
- **CI/CD:** GitHub Actions → Render deploy hook

## Environment Variables

| Variable | Verplicht | Beschrijving |
|----------|-----------|-------------|
| `TURSO_DATABASE_URL` | ✅ | Turso database URL (`libsql://...`) |
| `TURSO_AUTH_TOKEN` | ✅ | Turso authenticatie token (JWT) |
| `ADMIN_PASSWORD` | ✅ | Wachtwoord voor dashboard login |

### Waar instellen

- **Render:** Dashboard → Environment → Environment Variables
- **GitHub Actions:** Settings → Secrets → Actions (+ `RENDER_DEPLOY_HOOK_URL`)
- **Lokaal:** `.env` bestand (niet committen!)

## Lokaal draaien

```bash
# Environment variables
cp .env.example .env
# Vul de variabelen in

# Installeren
pnpm install

# Development
pnpm dev

# Build
pnpm build
```

## Deploy

### Automatisch (CI/CD)
Push naar `main` → GitHub Actions triggert Render deploy.

### Handmatig
Via Render dashboard: Manual Deploy → Deploy latest commit.

### Render configuratie
Staat in `render.yaml`. Bij het aanmaken van de service:
- Kies "Use render.yaml" of stel handmatig in:
  - **Build Command:** `corepack enable && pnpm install && pnpm run build`
  - **Publish Directory:** `dist`

## Database

Gebruikt dezelfde Turso database als MHJ. De feedback tabel wordt aangemaakt door MHJ's migratie (`server/migrations/001_feedback.sql`).

## Licentie

MIT — For The People Initiative
