import Phaser from 'phaser'
import {
  ASSET_KEYS,
  applyDinoDisplaySize,
  dinoTexture,
  hasEatFrames,
  setDinoTexture,
} from '../assets/assetManifest'
import { ANIM_TIMING } from '../config/animationTiming'

type GameStep = 'egg' | 'dino' | 'feed'

export class GameScene extends Phaser.Scene {
  private egg?: Phaser.GameObjects.Image
  private crackMarks: Phaser.GameObjects.Line[] = []
  private dinoBody?: Phaser.GameObjects.Image
  private rewardLayer?: Phaser.GameObjects.Container
  private food?: Phaser.GameObjects.Image
  private statusLabel?: Phaser.GameObjects.Text
  private currentStep: GameStep = 'egg'
  private idleFrame: 1 | 2 = 1
  /** Blocks idle texture swaps during eat / happy */
  private motionLocked = false

  constructor() {
    super('GameScene')
  }

  create(): void {
    const { width } = this.scale

    this.drawCuteBackground()

    this.statusLabel = this.add
      .text(width / 2, 60, 'Tap the egg', {
        fontFamily: 'Arial Rounded MT Bold, Arial, sans-serif',
        fontSize: '44px',
        color: '#11495d',
      })
      .setOrigin(0.5)

    this.createEgg()
    this.createDino()
    this.createFood()
  }

  private drawCuteBackground(): void {
    const { width, height } = this.scale

    this.add.image(width / 2, height / 2, ASSET_KEYS.bgSky)
  }

  private createEgg(): void {
    const { width, height } = this.scale

    this.egg = this.add
      .image(width / 2, height * 0.58, ASSET_KEYS.eggCute)
      .setInteractive({ useHandCursor: true })

    this.tweens.add({
      targets: this.egg,
      angle: { from: -4, to: 4 },
      duration: 250,
      repeat: -1,
      yoyo: true,
      ease: 'Sine.easeInOut',
    })

    this.egg.on('pointerdown', () => this.hatchEgg())
  }

  private createDino(): void {
    const { width, height } = this.scale

    this.dinoBody = this.add
      .image(width / 2, height * 0.6, dinoTexture(this, ASSET_KEYS.dinoIdle1))
      .setScale(0.01)
      .setVisible(false)
    applyDinoDisplaySize(this.dinoBody)

    this.tweens.add({
      targets: this.dinoBody,
      scaleX: 1.02,
      yoyo: true,
      repeat: -1,
      duration: 950,
      ease: 'Sine.easeInOut',
    })

    this.time.addEvent({
      delay: ANIM_TIMING.idleFrameMs,
      loop: true,
      callback: () => {
        if (
          !this.dinoBody ||
          !this.dinoBody.visible ||
          this.currentStep === 'egg' ||
          this.motionLocked
        ) {
          return
        }
        if (this.idleFrame === 1) {
          setDinoTexture(this.dinoBody, this, ASSET_KEYS.dinoIdle2)
          this.idleFrame = 2
        } else {
          setDinoTexture(this.dinoBody, this, ASSET_KEYS.dinoIdle1)
          this.idleFrame = 1
        }
      },
    })
  }

  private createFood(): void {
    const { height } = this.scale

    this.food = this.add
      .image(160, height - 140, ASSET_KEYS.foodApple)
      .setVisible(false)
      .setInteractive()

    this.input.setDraggable(this.food)

    this.input.on(
      'drag',
      (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.GameObject, dragX: number, dragY: number) => {
        if (gameObject !== this.food || this.currentStep !== 'feed') {
          return
        }

        this.food.setPosition(dragX, dragY)
      },
    )

    this.input.on('dragend', () => {
      if (!this.food || !this.dinoBody || this.currentStep !== 'feed') {
        return
      }

      const targetX = this.dinoBody.x + 45
      const targetY = this.dinoBody.y - 20
      const closeEnough =
        Phaser.Math.Distance.Between(this.food.x, this.food.y, targetX, targetY) < 120

      if (!closeEnough) {
        this.tweens.add({
          targets: this.food,
          x: 160,
          y: this.scale.height - 140,
          duration: 300,
          ease: 'Back.Out',
        })
        return
      }

      this.tweens.add({
        targets: this.food,
        x: targetX,
        y: targetY,
        scale: 0.2,
        alpha: 0,
        duration: 250,
        onComplete: () => {
          this.playEatAnimation(() => {
            this.dinoCelebrate()
            this.food?.setVisible(false)
          })
        },
      })
    })
  }

  private hatchEgg(): void {
    if (!this.egg || this.currentStep !== 'egg') {
      return
    }

    this.currentStep = 'dino'
    this.statusLabel?.setText('Dino is here!')

    this.egg.disableInteractive()

    for (let i = 0; i < 4; i += 1) {
      const mark = this.add.line(
        this.egg.x - 40 + i * 24,
        this.egg.y - 10 + i * 8,
        0,
        0,
        Phaser.Math.Between(10, 26),
        Phaser.Math.Between(18, 36),
        0x8b714f,
      )
      mark.setLineWidth(4)
      this.crackMarks.push(mark)
    }

    this.tweens.add({
      targets: this.egg,
      scaleX: 1.18,
      scaleY: 0.9,
      yoyo: true,
      duration: 260,
      ease: 'Quad.InOut',
      onComplete: () => this.showDino(),
    })
  }

  private showDino(): void {
    if (!this.dinoBody || !this.egg) {
      return
    }

    this.egg.setVisible(false)
    this.crackMarks.forEach((mark) => mark.setVisible(false))

    this.dinoBody.setVisible(true)
    this.tweens.add({
      targets: this.dinoBody,
      scale: 1,
      y: this.scale.height * 0.55,
      duration: 500,
      ease: 'Back.Out',
      onComplete: () => {
        this.dinoCelebrate()
        this.enableFeeding()
      },
    })
  }

  private enableFeeding(): void {
    if (!this.food) {
      return
    }

    this.currentStep = 'feed'
    this.statusLabel?.setText('Drag food to the dino')

    this.food
      .setVisible(true)
      .setAlpha(1)
      .setScale(1)
      .setPosition(160, this.scale.height - 140)
  }

  private dinoCelebrate(): void {
    if (!this.dinoBody) {
      return
    }

    this.playHappySound()

    this.motionLocked = true

    this.tweens.add({
      targets: this.dinoBody,
      y: this.dinoBody.y - 40,
      yoyo: true,
      duration: ANIM_TIMING.celebrateHopMs,
      repeat: 1,
      ease: 'Sine.Out',
    })

    this.tweens.add({
      targets: this.dinoBody,
      angle: { from: -3, to: 3 },
      duration: 180,
      yoyo: true,
      repeat: 2,
    })

    setDinoTexture(this.dinoBody, this, ASSET_KEYS.dinoHappy)
    this.time.delayedCall(ANIM_TIMING.happyHoldMs, () => {
      if (this.dinoBody) {
        setDinoTexture(this.dinoBody, this, ASSET_KEYS.dinoIdle1)
        this.idleFrame = 1
        this.motionLocked = false
      }
    })

    this.spawnStars()
  }

  private playEatAnimation(onDone: () => void): void {
    if (!this.dinoBody || !hasEatFrames(this)) {
      onDone()
      return
    }

    this.motionLocked = true

    const eatKeys = [
      ASSET_KEYS.dinoEat1,
      ASSET_KEYS.dinoEat2,
      ASSET_KEYS.dinoEat3,
      ASSET_KEYS.dinoEat4,
    ]
    let frame = 0
    setDinoTexture(this.dinoBody, this, eatKeys[0])

    const step = () => {
      frame += 1
      if (frame >= eatKeys.length) {
        this.motionLocked = false
        onDone()
        return
      }
      if (this.dinoBody) {
        setDinoTexture(this.dinoBody, this, eatKeys[frame])
      }
      this.time.delayedCall(ANIM_TIMING.eatFrameMs, step)
    }

    this.time.delayedCall(ANIM_TIMING.eatFrameMs, step)
  }

  private spawnStars(): void {
    this.rewardLayer?.destroy(true)
    this.rewardLayer = this.add.container(0, 0)

    for (let i = 0; i < 16; i += 1) {
      const star = this.add.star(
        Phaser.Math.Between(250, 780),
        Phaser.Math.Between(130, 460),
        5,
        8,
        16,
        0xffef70,
      )
      this.rewardLayer.add(star)

      this.tweens.add({
        targets: star,
        alpha: 0,
        y: star.y - Phaser.Math.Between(40, 90),
        angle: Phaser.Math.Between(-40, 40),
        duration: Phaser.Math.Between(500, 900),
        onComplete: () => star.destroy(),
      })
    }
  }

  private playHappySound(): void {
    const win = window as Window & {
      webkitAudioContext?: typeof AudioContext
    }
    const ContextClass = window.AudioContext ?? win.webkitAudioContext
    if (!ContextClass) {
      return
    }

    const context = new ContextClass()
    if (!context) {
      return
    }

    const now = context.currentTime
    const oscillator = context.createOscillator()
    const gainNode = context.createGain()

    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(300, now)
    oscillator.frequency.linearRampToValueAtTime(520, now + 0.08)
    oscillator.frequency.linearRampToValueAtTime(680, now + 0.18)

    gainNode.gain.setValueAtTime(0.001, now)
    gainNode.gain.exponentialRampToValueAtTime(0.07, now + 0.03)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    oscillator.connect(gainNode)
    gainNode.connect(context.destination)
    oscillator.start(now)
    oscillator.stop(now + 0.28)
    oscillator.onended = () => {
      context.close().catch(() => undefined)
    }
  }
}
