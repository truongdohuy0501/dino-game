import Phaser from 'phaser'

export const ASSET_KEYS = {
  bgSky: 'bg-sky',
  eggCute: 'egg-cute',
  foodApple: 'food-apple',
  dinoIdle1: 'dino-idle-1',
  dinoIdle2: 'dino-idle-2',
  dinoHappy: 'dino-happy',
  dinoEat1: 'dino-eat-1',
  dinoEat2: 'dino-eat-2',
  dinoEat3: 'dino-eat-3',
  dinoEat4: 'dino-eat-4',
} as const

/** On-screen size for dino (your PNGs may be 1024x1024 from DALL-E). */
export const DINO_DISPLAY_WIDTH = 360
export const DINO_DISPLAY_HEIGHT = 280

const DINO_FRAME_KEYS = [
  ASSET_KEYS.dinoIdle1,
  ASSET_KEYS.dinoIdle2,
  ASSET_KEYS.dinoHappy,
  ASSET_KEYS.dinoEat1,
  ASSET_KEYS.dinoEat2,
  ASSET_KEYS.dinoEat3,
  ASSET_KEYS.dinoEat4,
] as const

const DINO_SVG_FALLBACK: { key: string; path: string; width: number; height: number }[] = [
  { key: ASSET_KEYS.dinoIdle1, path: '/assets/images/dino-idle-1.svg', width: 360, height: 280 },
  { key: ASSET_KEYS.dinoIdle2, path: '/assets/images/dino-idle-2.svg', width: 360, height: 280 },
  { key: ASSET_KEYS.dinoHappy, path: '/assets/images/dino-happy.svg', width: 360, height: 280 },
]

const SCENE_SVG_ASSETS: { key: string; path: string; width: number; height: number }[] = [
  { key: ASSET_KEYS.bgSky, path: '/assets/images/sky-bg.svg', width: 1024, height: 768 },
  { key: ASSET_KEYS.eggCute, path: '/assets/images/egg-cute.svg', width: 260, height: 320 },
  { key: ASSET_KEYS.foodApple, path: '/assets/images/food-apple.svg', width: 128, height: 128 },
]

const svgFallbackKey = (pngKey: string): string => `${pngKey}-svg`

const textureLoaded = (scene: Phaser.Scene, key: string): boolean => {
  if (!scene.textures.exists(key)) {
    return false
  }
  const tex = scene.textures.get(key)
  const source = tex.source[0]
  if (!source || tex.key === '__MISSING') {
    return false
  }
  // Real PNG from public/ is large; failed loads are 0–1 px placeholders.
  return source.width > 32 && source.height > 32
}

export const preloadGameAssets = (scene: Phaser.Scene): void => {
  SCENE_SVG_ASSETS.forEach((asset) => {
    scene.load.svg(asset.key, asset.path, {
      width: asset.width,
      height: asset.height,
    })
  })

  DINO_SVG_FALLBACK.forEach((asset) => {
    scene.load.svg(svgFallbackKey(asset.key), asset.path, {
      width: asset.width,
      height: asset.height,
    })
  })

  DINO_FRAME_KEYS.forEach((key) => {
    scene.load.image(key, `/assets/images/dino/${key}.png`)
  })
}

/** PNG from public/assets/images/dino/ if loaded; else bundled SVG. */
export const dinoTexture = (scene: Phaser.Scene, key: string): string => {
  if (textureLoaded(scene, key)) {
    return key
  }
  const fallback = svgFallbackKey(key)
  return scene.textures.exists(fallback) ? fallback : key
}

export const applyDinoDisplaySize = (image: Phaser.GameObjects.Image): void => {
  image.setDisplaySize(DINO_DISPLAY_WIDTH, DINO_DISPLAY_HEIGHT)
}

export const setDinoTexture = (
  image: Phaser.GameObjects.Image,
  scene: Phaser.Scene,
  key: string,
): void => {
  image.setTexture(dinoTexture(scene, key))
  applyDinoDisplaySize(image)
}

export const hasEatFrames = (scene: Phaser.Scene): boolean =>
  [ASSET_KEYS.dinoEat1, ASSET_KEYS.dinoEat2, ASSET_KEYS.dinoEat3, ASSET_KEYS.dinoEat4].every(
    (key) => textureLoaded(scene, key),
  )
