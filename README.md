# Madhan Jothimani: portfolio

Personal site for quantitative finance and machine learning work. Next.js 16 (App Router), React 19, Tailwind CSS 3 (base reset only; the design system lives in `app/globals.css`). Deployed on Vercel from `main`.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (all pages are static)
npm start        # serve the production build
npm run lint
```

## Where things live

| Path | What |
|---|---|
| `lib/content.js` | All site copy: projects, awards, education, toolkit. Edit text here. |
| `data/*.json` | Results pulled from the project repos (see below). Every chart reads from these. |
| `lib/quant.js` | Black-Scholes + Greeks, CRR tree, Monte Carlo (antithetic + control variate), Deflated Sharpe. |
| `components/MonteCarloHero.js` | Live GBM simulation behind the hero (pauses off-screen; static with reduced motion). |
| `components/lab/` | Options pricer and overfitting explorer. |
| `components/charts/` | Hand-built SVG charts: line, bar, table view. |
| `components/case/` | Case-study pages, served at `/work/[slug]`. |
| `app/opengraph-image.js` | The 1200×630 share card for LinkedIn and other link previews. |

## Refreshing project data

The charts and interactives use published results from the `options-lab` and `strategy-search` repos. After those results change:

```bash
node scripts/sync-data.mjs
```

The interactive numbers are checked against the repos: the textbook preset prices the call at 9.52354, and the explorer reproduces DSR 0.288 at N = 240.

## Custom domain

Once a custom domain is live, set `NEXT_PUBLIC_SITE_URL` (e.g. `https://example.com`) in Vercel so share-card URLs use it. Until then, Vercel's production URL is used automatically.
