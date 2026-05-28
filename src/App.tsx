import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { createGameConfig } from './game/config'
import './App.css'

function App() {
  const gameContainerRef = useRef<HTMLDivElement | null>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!gameContainerRef.current || gameRef.current) {
      return
    }

    gameRef.current = new Phaser.Game(createGameConfig(gameContainerRef.current))

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  return (
    <main className="app-shell">
      <header className="hud">
        <h1>Dino Egg Adventure</h1>
        <p>Tap the egg, meet your dino friend!</p>
      </header>
      <div ref={gameContainerRef} className="game-container" />
    </main>
  )
}

export default App
