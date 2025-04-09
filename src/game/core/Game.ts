import * as THREE from "three";
import { Scene } from "./Scene";
import { Renderer } from "./Renderer";
import { Camera } from "./Camera";
import { AssetLoader } from "../utils/AssetLoader";
import type { WantedSystem } from "../systems/WantedSystem";
import type { SoundSystem } from "../systems/SoundSystem";

export class Game {
  private renderer: Renderer;
  private scene: Scene;
  private camera: Camera;
  private assetLoader: AssetLoader;
  private wantedSystem: WantedSystem | null = null;
  private soundSystem: SoundSystem | null = null;
  private clock: THREE.Clock;
  private isRunning = false;
  private container: HTMLElement;
  private cameraOffset = new THREE.Vector3(0, 10, 10); // Position camera above and behind player

  constructor(container: HTMLElement) {
    this.container = container;
    this.clock = new THREE.Clock();

    // Initialize core components
    this.renderer = new Renderer(container);
    this.camera = new Camera();
    this.scene = new Scene();
    this.assetLoader = new AssetLoader();
  }

  public async initialize(): Promise<void> {
    // Load initial assets
    await this.assetLoader.loadInitialAssets();

    // Setup initial scene
    this.scene.setup();

    // Initialize game systems
    const player = this.scene.getPlayer();
    if (player) {
      // Import the systems dynamically to avoid circular dependencies
      const [{ WantedSystem }, { SoundSystem }] = await Promise.all([
        import("../systems/WantedSystem"),
        import("../systems/SoundSystem"),
      ]);

      this.wantedSystem = new WantedSystem(player, this.scene);
      this.soundSystem = new SoundSystem();
    }

    // Add camera to scene
    this.scene.add(this.camera.getObject());

    // Set up event listeners
    window.addEventListener("resize", this.onResize.bind(this));

    // Initial resize to set correct dimensions
    this.onResize();
  }

  public start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.clock.start();
    this.animate();

    // Start background music
    if (this.soundSystem) {
      this.soundSystem.playMusic();
    }
  }

  public stop(): void {
    this.isRunning = false;
    this.clock.stop();

    // Pause background music
    if (this.soundSystem) {
      this.soundSystem.pauseMusic();
    }
  }

  private animate = (): void => {
    if (!this.isRunning) return;

    requestAnimationFrame(this.animate);

    const deltaTime = this.clock.getDelta();

    // Update game logic
    this.update(deltaTime);

    // Render the scene
    this.renderer.render(this.scene.getScene(), this.camera.getCamera());
  };

  private update(deltaTime: number): void {
    // Update game systems and entities
    this.scene.update(deltaTime);

    // Update wanted system
    if (this.wantedSystem && this.scene.getPlayer()) {
      this.wantedSystem.update(deltaTime);
    }

    // Update camera to follow player
    this.updateCamera(deltaTime);
  }

  private updateCamera(deltaTime: number): void {
    const player = this.scene.getPlayer();
    if (!player) return;

    const playerObject = player.getObject();
    if (!playerObject) return;

    // Get player position and rotation
    const playerPosition = playerObject.position.clone();

    // Create target position for camera: offset from player position
    const targetPosition = playerPosition.clone();

    // Update camera position to follow player
    this.camera.update(deltaTime, targetPosition);

    // Optionally rotate camera based on player rotation
    // this.camera.setRotation(playerObject.rotation.y);
  }

  private onResize(): void {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.updateAspect(width / height);
    this.renderer.setSize(width, height);
  }

  public dispose(): void {
    // Clean up resources
    this.stop();

    // Dispose systems
    if (this.soundSystem) {
      this.soundSystem.dispose();
    }

    window.removeEventListener("resize", this.onResize.bind(this));
    this.renderer.dispose();
    this.scene.dispose();
  }

  public getPlayer() {
    return this.scene.getPlayer();
  }

  public reset(): void {
    // Stop current game
    this.stop();

    // Dispose systems
    if (this.soundSystem) {
      this.soundSystem.dispose();
      this.soundSystem = null;
    }

    // Dispose old scene
    this.scene.dispose();

    // Create a new scene
    this.scene = new Scene();

    // Set up the new scene
    this.scene.setup();

    // Reinitialize game systems
    const player = this.scene.getPlayer();
    if (player) {
      // Need to reinitialize this asynchronously
      Promise.all([import("../systems/WantedSystem"), import("../systems/SoundSystem")]).then(
        ([{ WantedSystem }, { SoundSystem }]) => {
          this.wantedSystem = new WantedSystem(player, this.scene);
          this.soundSystem = new SoundSystem();
        }
      );
    } else {
      this.wantedSystem = null;
      this.soundSystem = null;
    }

    // Add camera to scene
    this.scene.add(this.camera.getObject());

    // Start the game again
    this.start();
  }
}
