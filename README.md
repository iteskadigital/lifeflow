# Davide Rossi — Portfolio one-page

Sito portfolio in italiano per Davide Rossi, digital strategist e web developer. È realizzato con Next.js, TypeScript e CSS responsive.

## Avvio locale

```bash
npm install
npm run dev
```

Il sito sarà disponibile su `http://localhost:9002`.

## Configurazione

Impostare `NEXT_PUBLIC_SITE_URL` con il dominio pubblico definitivo per generare canonical URL, sitemap e file robots corretti:

```bash
NEXT_PUBLIC_SITE_URL=https://www.daviderossi.it
```

Prima della pubblicazione, verificare anche l'indirizzo email presente nei link di contatto in `src/app/page.tsx`.

## Controlli

```bash
npm run typecheck
npm run build
```
