import * as THREE from "three";
import type { Player } from "../entities/Player";
import type { Scene } from "../core/Scene";

export class WantedSystem {
  private player: Player;
  private scene: Scene;
  private maxWantedLevel = 5;
  private decayTimer = 0;
  private decayDelay = 30; // Seconds before wanted level starts to decay
  private decayRate = 0.1; // Points per second
  private lastWantedLevel = 0;
  private pursuitActive = false;
  private alertRadius = 100; // Distance at which authorities will detect the player

  constructor(player: Player, scene: Scene) {
    this.player = player;
    this.scene = scene;

    // Set initial state
    this.lastWantedLevel = player.getWantedLevel();
  }

  public update(deltaTime: number): void {
    const currentWantedLevel = this.player.getWantedLevel();

    // If wanted level increased, reset decay timer
    if (currentWantedLevel > this.lastWantedLevel) {
      this.decayTimer = 0;
      this.lastWantedLevel = currentWantedLevel;

      // If wanted level reaches a threshold, start pursuit
      if (currentWantedLevel >= 2 && !this.pursuitActive) {
        this.startPursuit();
      }
    }

    // Update decay timer
    if (currentWantedLevel > 0) {
      this.decayTimer += deltaTime;

      // If enough time has passed, start decaying wanted level
      if (this.decayTimer >= this.decayDelay) {
        // Reduce wanted level over time
        const decay = this.decayRate * deltaTime;

        // Only reduce if the player isn't committing more crimes
        if (!this.isPlayerCommittingCrimes()) {
          this.player.decreaseWantedLevel();
          this.lastWantedLevel = this.player.getWantedLevel();

          // If wanted level dropped below threshold, end pursuit
          if (this.lastWantedLevel < 2 && this.pursuitActive) {
            this.endPursuit();
          }
        }
      }
    } else {
      // Reset timer if wanted level is 0
      this.decayTimer = 0;
    }

    // Update pursuit logic if active
    if (this.pursuitActive) {
      this.updatePursuit(deltaTime);
    }
  }

  private isPlayerCommittingCrimes(): boolean {
    // This would be a more complex check in a full implementation
    // For now, we just use a simple timer-based approach
    return this.decayTimer < this.decayDelay;
  }

  private startPursuit(): void {
    this.pursuitActive = true;
    console.log("Authorities are now pursuing the player!");

    // TODO: Spawn authorities to chase the player
    // For the MVP, we'll just log the state change
  }

  private endPursuit(): void {
    this.pursuitActive = false;
    console.log("The pursuit has ended!");

    // TODO: Remove pursuing authorities
    // For the MVP, we'll just log the state change
  }

  private updatePursuit(deltaTime: number): void {
    // TODO: Update authority AI and pursuit mechanics
    // For the MVP, we'll leave this as a placeholder

    // The intensity of the pursuit depends on the wanted level
    const intensity = this.player.getWantedLevel() / this.maxWantedLevel;

    // Example: Adjust pursuit parameters based on intensity
    this.alertRadius = 100 + intensity * 100; // Ranges from 100 to 200
  }

  public isPursuitActive(): boolean {
    return this.pursuitActive;
  }

  public getAlertRadius(): number {
    return this.alertRadius;
  }
}
