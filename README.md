# Dino Egg Adventure

Simple toddler-friendly dinosaur game using React + Phaser.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Vercel auto-detects Vite. Click **Deploy** (defaults: build `npm run build`, output `dist`).
4. You get a URL like `https://dino-game-xxx.vercel.app`.

After adding new DALL-E PNGs locally, run `npm run fix-assets` before commit.

## Deploy (GitHub Pages with CI/CD)

This repository includes GitHub Actions workflows:

- `CI`: runs lint + build on push / pull request
- `Deploy to GitHub Pages`: builds and deploys `main` to Pages

### One-time GitHub settings

1. Go to `Settings` -> `Pages`.
2. In **Build and deployment**, choose **Source: GitHub Actions**.
3. Push to `main` and wait for the deploy workflow to finish.

Demo URL format:

`https://<github-username>.github.io/<repo-name>/`

## Current Game Flow

- Tap egg
- Egg cracks
- Dino appears
- Dino celebrates
- Drag food to feed dino

## Asset Pipeline

Asset keys and preload setup live in `src/game/assets/assetManifest.ts`.

When replacing art, keep keys stable and only update file paths/sizes there.

Solo workflow guide: `docs/solo-asset-workflow.md`
