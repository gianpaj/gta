import type React from "react";
import styles from "../app/page.module.css";

interface GameHUDProps {
  score: number;
  health: number;
  wantedLevel: number;
  isVisible: boolean;
}

const GameHUD: React.FC<GameHUDProps> = ({ score, health, wantedLevel, isVisible }) => {
  if (!isVisible) return null;

  // Create star elements for wanted level display
  const wantedStars = [];
  for (let i = 0; i < 5; i++) {
    wantedStars.push(<div key={`star-${i}`} className={`${styles.star} ${i < wantedLevel ? styles.active : ""}`} />);
  }

  return (
    <div className={styles.gameHUD}>
      <div className={styles.topBar}>
        <div className={styles.scoreDisplay}>
          <span className={styles.scoreLabel}>SCORE:</span>
          <span className={styles.scoreValue}>{score}</span>
        </div>
        <div className={styles.wantedLevel}>{wantedStars}</div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.healthBar}>
          <div className={styles.healthBarInner} style={{ width: `${health}%` }} />
        </div>
      </div>
    </div>
  );
};

export default GameHUD;
