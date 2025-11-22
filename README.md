<h1 align="center">NotreColoc</h1>

Application Next.js (App Router) pour gérer la vie en colocation : authentification, onboarding, dashboard, réservations, invitations, outils collaboratifs et préférences compte.  
Stack principale : Next.js 16, React Server Components, Server Actions, Prisma + SQLite, Redis (cache & rate limit), Tailwind v4, shadcn/ui, Vitest & Playwright.

## 🚀 Prise en main

```bash
cp .env.example .env        # configure DATABASE_URL, SESSION_SECRET, REDIS_URL…
npm install
npx prisma generate         # génère le client Prisma
# Si tu veux recréer la base
# npx prisma migrate dev --name init
npm run dev
```

L’application est accessible sur http://localhost:3000.  
Le service worker (PWA) s’enregistre automatiquement en mode production.

## 🧱 Architecture

- `app/(auth)` : login & register avec rate limiting Redis + CSRF.
- `app/(onboarding)` : intégrations, wizard de création de coloc, acceptation d’invitations `/i`.
- `app/(app)` : tout le dashboard authentifié (sidebar + navigation mobile).
- `components/` : UI shadcn personnalisée, layouts, formulaires (wizard, réservations…).
- `db/` & `prisma/` : client Prisma, schéma SQLite, migrations manuelles (`prisma/migrations`).
- `lib/` : auth custom (sessions, CSRF, rate limit), cache Redis, validations Zod, invitations.
- `tests/` : Vitest (unit) + Playwright (E2E basiques).

## ✨ Fonctionnalités livrées

- Sessions sécurisées (hash SHA-256 + cookie httpOnly) & middleware de protection des routes.
- Auth + onboarding multicoloc (switcher, invitations, creation wizard).
- Dashboard `/accueil` avec caches Redis, stats, modules actifs, quick actions.
- Outil Réservations : vue semaine + mobile, création via Server Action (détection chevauchement).
- Outil Dépenses partagées : UI complète prête pour la future persistance.
- Gestion Colocation : configuration (modules, préférences), membres, invitations (copie lien/code).
- Outils placeholders (repas, tâches, listes, etc.) prêts pour activation via settings.
- Préférences compte : profil, sécurité (changements mot de passe), notifications.
- PWA (manifest + service worker cache-first), theming clair/sombre, responsive mobile-first.

## 🧪 Tests & scripts

| Script                | Description                                |
|----------------------|--------------------------------------------|
| `npm run dev`        | Dev server Next.js                         |
| `npm run build`      | Build production                           |
| `npm run start`      | Démarrage production                       |
| `npm run lint`       | ESLint Next + règles shadcn                |
| `npm run test:unit`  | Vitest (ex: rate limiting)                 |
| `npm run test:e2e`   | Playwright (`tests/e2e`)                    |
| `npm run prisma:*`   | Helpers Prisma (generate / migrate)        |

## 🔐 Variables d’environnement

| Variable              | Exemple                      | Rôle                                  |
|----------------------|------------------------------|---------------------------------------|
| `DATABASE_URL`       | `file:./prisma/dev.db`       | Base SQLite                           |
| `SESSION_SECRET`     | `min-32-chars-secret`        | Hash cookies/session/CSRF             |
| `REDIS_URL`          | `redis://localhost:6379`     | Cache + rate limit                    |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000`   | URL utilisée pour PWA & liens invites |

## 📌 Notes

- Prisma fonctionne avec SQLite (fichier `prisma/dev.db`). Les migrations SQL initiales sont fournies dans `prisma/migrations/0001_init/migration.sql`.
- Redis est optionnel (fallback mémoire pour le rate limit), mais recommandé en production pour le cache dashboard.
- Toutes les chaînes UI sont en français, accessibles et responsives (sidebar desktop + tabbar mobile).
