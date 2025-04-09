"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../app/page.module.css";
import { Game } from "../game/core/Game";
import GameHUD from "./GameHUD";

type GameState = "menu" | "playing" | "gameover";

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [gameState, setGameState] = useState<GameState>("menu");
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [wantedLevel, setWantedLevel] = useState(0);
  const gameLoopRef = useRef<number | null>(null);

  // Initialize game on component mount
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    gameRef.current = new Game(container);

    // Initialize game
    const initGame = async () => {
      if (!gameRef.current) return;

      try {
        await gameRef.current.initialize();
        console.log("Game initialized successfully");
      } catch (error) {
        console.error("Error initializing game:", error);
      }
    };

    initGame();

    // Clean up on unmount
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }

      if (gameRef.current) {
        gameRef.current.dispose();
        gameRef.current = null;
      }
    };
  }, []);

  // Handle game state changes
  useEffect(() => {
    if (!gameRef.current) return;

    if (gameState === "playing") {
      gameRef.current.start();

      // Start game loop to update UI stats
      const updateGameStats = () => {
        if (!gameRef.current || gameState !== "playing") return;

        const player = gameRef.current.getPlayer();
        if (player) {
          // Update score
          const playerScore = player.getScore();
          setScore(playerScore);

          // Update health
          const playerHealth = player.getHealthPercent();
          setHealth(playerHealth);

          // Update wanted level
          const playerWantedLevel = player.getWantedLevel();
          setWantedLevel(playerWantedLevel);

          // Check for game over
          if (playerHealth <= 0) {
            setGameState("gameover");
            return;
          }
        }

        // Continue the loop
        gameLoopRef.current = requestAnimationFrame(updateGameStats);
      };

      gameLoopRef.current = requestAnimationFrame(updateGameStats);
    } else {
      // Stop the game and game loop
      gameRef.current.stop();

      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    }
  }, [gameState]);

  // Start the game from menu
  const handleStartGame = () => {
    setGameState("playing");
    setScore(0);
    setWantedLevel(0);
    setHealth(100);
  };

  // Resume game from game over
  const handleRestartGame = () => {
    // Reload the game scene
    if (gameRef.current) {
      gameRef.current.reset();
    }

    setGameState("playing");
    setScore(0);
    setWantedLevel(0);
    setHealth(100);
  };

  // Return to menu
  const handleReturnToMenu = () => {
    setGameState("menu");
  };

  return (
    <div className={styles.gameContainer} ref={containerRef}>
      {/* Game HUD - only shown while playing */}
      <GameHUD score={score} health={health} wantedLevel={wantedLevel} isVisible={gameState === "playing"} />

      {/* Menu overlay */}
      {gameState === "menu" && (
        <div className={styles.menuOverlay}>
          <h1 className={styles.menuTitle}>Roman Rampage</h1>
          <div className={styles.menuContent}>
            <p className={styles.menuDescription}>
              Cause chaos in ancient Rome! Steal chariots, destroy stalls, and evade the authorities.
            </p>
            <button type="button" className={styles.button} onClick={handleStartGame}>
              Start Game
            </button>
          </div>
        </div>
      )}

      {/* Game over overlay */}
      {gameState === "gameover" && (
        <div className={styles.menuOverlay}>
          <h1 className={styles.menuTitle}>Game Over</h1>
          <div className={styles.menuContent}>
            <p className={styles.scoreText}>Your Score: {score}</p>
            <button type="button" className={styles.button} onClick={handleRestartGame}>
              Play Again
            </button>
            <button type="button" className={styles.secondaryButton} onClick={handleReturnToMenu}>
              Main Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
