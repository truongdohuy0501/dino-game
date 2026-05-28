import Phaser from 'phaser'
import { ASSET_KEYS, applyDinoDisplaySize, dinoTexture } from '../assets/assetManifest'

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene')
  }

  create(): void {
    const { width, height } = this.scale

    this.add.image(width / 2, height / 2, ASSET_KEYS.bgSky)
    const mascot = this.add.image(width / 2, height / 2 + 40, dinoTexture(this, ASSET_KEYS.dinoIdle1))
    applyDinoDisplaySize(mascot)

    this.add
      .text(width / 2, 122, 'Dino Egg Adventure', {
        fontFamily: 'Arial Rounded MT Bold, Arial, sans-serif',
        fontSize: '56px',
        color: '#124d61',
      })
      .setOrigin(0.5)

    this.add
      .text(width / 2, 192, 'Tap Play to start', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '32px',
        color: '#1d677e',
      })
      .setOrigin(0.5)

    const playButton = this.add
      .rectangle(width / 2, height - 170, 320, 120, 0xffcc4d)
      .setStrokeStyle(6, 0xffffff)
      .setInteractive({ useHandCursor: true })

    const playText = this.add
      .text(playButton.x, playButton.y, 'PLAY', {
        fontFamily: 'Arial Rounded MT Bold, Arial, sans-serif',
        fontSize: '52px',
        color: '#6f4a00',
      })
      .setOrigin(0.5)

    this.tweens.add({
      targets: [playButton, playText],
      scale: 1.04,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    this.tweens.add({
      targets: mascot,
      y: mascot.y - 10,
      duration: 850,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    playButton.on('pointerdown', () => {
      this.scene.start('GameScene')
    })
  }
}
