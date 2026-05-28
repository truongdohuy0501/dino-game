# Solo Asset Workflow (Phaser + AI + Aseprite)

This workflow is optimized for one developer making a toddler-friendly 2D game.

## Recommended Tools

- AI concept art: Leonardo, Midjourney, or DALL-E
- Drawing cleanup and recolor: Figma or Krita
- Sprite animation: Aseprite
- Optional rig animation: Rive (export sprite sheets)

## Daily Loop (Fast and Simple)

1. Generate 3-5 concept variants of one character or background.
2. Pick one style and keep only that style for consistency.
3. Clean up and recolor into the game's pastel palette.
4. Export idle/happy/eat frames from Aseprite.
5. Save PNGs into `public/assets/images/dino/` using the exact names below.
6. Run `npm run dev` (no code change needed if names match).
7. Test on iPad Safari.

### Where to drop DALL-E / Aseprite exports

```
public/assets/images/dino/
  dino-idle-1.png    ← standing / breathing
  dino-idle-2.png    ← blink or tiny movement
  dino-happy.png     ← smile / jump (after egg hatches)
  dino-eat-1.png     ← optional
  dino-eat-2.png
  dino-eat-3.png
  dino-eat-4.png
```

| When in game | Texture used |
|--------------|----------------|
| Dino visible, waiting | idle-1 ↔ idle-2 loop |
| Egg just hatched / celebrate | happy → idle-1 |
| Food reaches dino | eat-1…4 (if files exist) → happy |

## Asset Specs

- Character base size: 360x280
- Item size (food): 128x128
- Egg size: 260x320
- Background: 1024x768
- Keep transparent background for all characters/items.

## Naming Convention

- `dino-idle-1.png`, `dino-idle-2.png`
- `dino-happy.png`
- `egg-cute.png`
- `food-apple.png`
- `sky-bg.png`

Use the same keys in `assetManifest.ts` so scenes do not need changes.

## Checkerboard / fake transparency (common DALL-E issue)

If the game shows gray-white squares or a **dark/black checkerboard** behind the
dino, the PNG has **no real alpha** — the preview grid was saved into the image.
(DALL-E often exports a dark grid `#363636`, not only light gray.)

Fix:

1. Export again as **PNG** with true transparency, or use [remove.bg](https://www.remove.bg/).
2. Or run in project root:

```bash
npm run fix-assets
```

Then hard-refresh the browser (`Cmd+Shift+R`).

## Quality Checklist (Toddler Focus)

- Big eyes, rounded forms, soft contrast
- No dark horror color combinations
- Every interaction has visual feedback
- Keep action readable in under 1 second
- Avoid dense UI and tiny hit targets
