# Web App

Frontend package for StellarFund.

This README is intentionally scoped to the browser app in `apps/web`. For repository-wide setup, use the root `README.md`.

## Responsibilities

- Connect to Freighter and read the active Stellar address
- Simulate, sign, and submit Soroban contract transactions
- Render the landing page, escrow dashboard, lookup flow, and activity history
- Build a static Vite app for local development and Vercel deployment

## Run Locally

```bash
cd apps/web
npm install
npm run dev
```

Dev server defaults to `http://localhost:8080`.

## Build And Test

```bash
npm run build
npm run test
npm run lint
```

## Important Files

```text
apps/web
|- public/                       Static assets served directly by Vite
|- src/assets/                   Runtime images and logos
|- src/components/               Shared UI and layout primitives
|- src/features/wallet/          Freighter and wallet-facing flows
|- src/lib/config.ts             Network and contract constants
|- src/lib/soroban.ts            Soroban RPC transaction helpers
|- src/pages/Index.tsx           Marketing landing page
|- src/pages/AppPage.tsx         Connected escrow dashboard
|- package.json
`- vite.config.ts
```

## Deployment Notes

- The production build output is `apps/web/dist`.
- Vercel is configured from the repository root, not from this folder.
