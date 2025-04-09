"use client";

import { useEffect, useRef } from "react";
import styles from "./page.module.css";
import dynamic from "next/dynamic";

// Dynamically import the game component with no SSR
const GameCanvas = dynamic(() => import("../components/GameCanvas"), { ssr: false });

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Roman Rampage</h1>
        <div className={styles.gameContainer}>
          <GameCanvas />
        </div>
      </main>
    </div>
  );
}
