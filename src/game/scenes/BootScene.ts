import Phaser from 'phaser'
import { preloadGameAssets } from '../assets/assetManifest'

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload(): void {
    preloadGameAssets(this)
  }

  create(): void {
    this.scene.start('MenuScene')
  }
}
