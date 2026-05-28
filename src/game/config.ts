import Phaser from 'phaser'
import { BootScene } from './scenes/BootScene'
import { GameScene } from './scenes/GameScene'
import { MenuScene } from './scenes/MenuScene'

export const createGameConfig = (
  parent: HTMLDivElement,
): Phaser.Types.Core.GameConfig => ({
  type: Phaser.AUTO,
  parent,
  width: 1024,
  height: 768,
  backgroundColor: '#87ceeb',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, MenuScene, GameScene],
  physics: {
    default: 'arcade',
  },
})
