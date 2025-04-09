import * as THREE from "three";
import type { Entity } from "../entities/Entity";
import { Player } from "../entities/Player";
import { Vehicle, VehicleType } from "../entities/Vehicle";
import { DestructibleObject, DestructibleType } from "../entities/DestructibleObject";

export class Scene {
  private scene: THREE.Scene;
  private entities: Entity[] = [];
  private ambientLight: THREE.AmbientLight;
  private directionalLight: THREE.DirectionalLight;
  private hemisphereLight: THREE.HemisphereLight;
  private player: Player | null = null;
  private vehicles: Vehicle[] = [];
  private destructibles: DestructibleObject[] = [];
  private gameTime = 0; // Time in seconds since scene started
  private dayNightCycle = {
    dayDuration: 300, // 5 minutes per day
    currentTimeOfDay: 0, // 0-1, where 0 is midnight, 0.25 is sunrise, 0.5 is noon, 0.75 is sunset
  };

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb); // Sky blue background

    // Add ambient light
    this.ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(this.ambientLight);

    // Add directional light (sun)
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(50, 70, 30);
    this.directionalLight.castShadow = true;

    // Configure shadow properties
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.mapSize.height = 2048;
    this.directionalLight.shadow.camera.near = 0.5;
    this.directionalLight.shadow.camera.far = 500;
    this.directionalLight.shadow.camera.left = -100;
    this.directionalLight.shadow.camera.right = 100;
    this.directionalLight.shadow.camera.top = 100;
    this.directionalLight.shadow.camera.bottom = -100;

    this.scene.add(this.directionalLight);

    // Add hemisphere light for more natural outdoor lighting
    this.hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xb97a20, 0.6);
    this.scene.add(this.hemisphereLight);

    // Set up event listeners
    if (typeof window !== "undefined") {
      window.addEventListener("player-attack", this.handlePlayerAttack as EventListener);
      window.addEventListener("player-interact", this.handlePlayerInteract as EventListener);
    }
  }

  public setup(): void {
    // Create a ground plane
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x91814d, // Dirt/sand color
      roughness: 0.9,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Add a simple grid for reference during development
    const grid = new THREE.GridHelper(1000, 100, 0x000000, 0x000000);
    grid.position.y = 0.01; // Slightly above ground to avoid z-fighting
    this.scene.add(grid);

    // Add some basic buildings to the scene
    this.createBasicEnvironment();

    // Add vehicles to the scene
    this.createVehicles();

    // Add destructible objects
    this.createDestructibleObjects();

    // Create and add player
    this.createPlayer();
  }

  private createPlayer(): void {
    this.player = new Player();
    this.addEntity(this.player);
  }

  private createBasicEnvironment(): void {
    // Create a few simple buildings
    for (let i = 0; i < 10; i++) {
      const buildingWidth = 5 + Math.random() * 10;
      const buildingDepth = 5 + Math.random() * 10;
      const buildingHeight = 3 + Math.random() * 12;

      const buildingGeometry = new THREE.BoxGeometry(buildingWidth, buildingHeight, buildingDepth);
      const buildingMaterial = new THREE.MeshStandardMaterial({
        color: 0xe8d8c0, // Roman building color
        roughness: 0.8,
        metalness: 0.1,
      });

      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);

      // Position buildings in a random layout
      const posX = (Math.random() - 0.5) * 200;
      const posZ = (Math.random() - 0.5) * 200;

      building.position.set(posX, buildingHeight / 2, posZ);
      building.castShadow = true;
      building.receiveShadow = true;

      this.scene.add(building);
    }
  }

  private createVehicles(): void {
    // Create a few vehicles around the scene

    // Add a chariot near the center
    const chariot = new Vehicle(VehicleType.CHARIOT);
    chariot.getObject().position.set(5, 0, 5);
    chariot.getObject().rotation.y = Math.PI / 4;
    this.addEntity(chariot);
    this.vehicles.push(chariot);

    // Add a cart a bit further away
    const cart = new Vehicle(VehicleType.CART);
    cart.getObject().position.set(-15, 0, 20);
    cart.getObject().rotation.y = -Math.PI / 6;
    this.addEntity(cart);
    this.vehicles.push(cart);

    // Add another chariot
    const chariot2 = new Vehicle(VehicleType.CHARIOT);
    chariot2.getObject().position.set(30, 0, -10);
    chariot2.getObject().rotation.y = Math.PI;
    this.addEntity(chariot2);
    this.vehicles.push(chariot2);
  }

  private createDestructibleObjects(): void {
    // Create various destructible objects around the scene

    // Create a cluster of barrels
    this.createDestructibleCluster(DestructibleType.BARREL, new THREE.Vector3(12, 0, 8), 5, 2);

    // Create some crates
    this.createDestructibleCluster(DestructibleType.CRATE, new THREE.Vector3(-8, 0, -10), 8, 3);

    // Add a few market stalls
    const stallPositions = [
      new THREE.Vector3(20, 0, 15),
      new THREE.Vector3(25, 0, 15),
      new THREE.Vector3(20, 0, 20),
      new THREE.Vector3(25, 0, 20),
    ];

    for (const position of stallPositions) {
      const stall = new DestructibleObject(DestructibleType.STALL, position);
      this.addEntity(stall);
      this.destructibles.push(stall);
    }

    // Add some pots around
    const potPositions = [
      new THREE.Vector3(22, 0, 10),
      new THREE.Vector3(23, 0, 10),
      new THREE.Vector3(22, 0, 25),
      new THREE.Vector3(23, 0, 25),
      new THREE.Vector3(18, 0, 17),
      new THREE.Vector3(27, 0, 17),
    ];

    for (const position of potPositions) {
      const pot = new DestructibleObject(DestructibleType.POT, position);
      this.addEntity(pot);
      this.destructibles.push(pot);
    }

    // Add some fences
    for (let i = 0; i < 5; i++) {
      const fence = new DestructibleObject(DestructibleType.FENCE, new THREE.Vector3(-15 + i * 2.2, 0, -15));
      fence.getObject().rotation.y = 0;
      this.addEntity(fence);
      this.destructibles.push(fence);
    }

    for (let i = 0; i < 5; i++) {
      const fence = new DestructibleObject(DestructibleType.FENCE, new THREE.Vector3(-15, 0, -15 + i * 2.2));
      fence.getObject().rotation.y = Math.PI / 2;
      this.addEntity(fence);
      this.destructibles.push(fence);
    }
  }

  private createDestructibleCluster(
    type: DestructibleType,
    centerPosition: THREE.Vector3,
    count: number,
    radius: number
  ): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius;
      const offset = new THREE.Vector3(Math.cos(angle) * distance, 0, Math.sin(angle) * distance);

      const position = centerPosition.clone().add(offset);
      const rotation = Math.random() * Math.PI * 2;

      const destructible = new DestructibleObject(type, position);
      destructible.getObject().rotation.y = rotation;
      this.addEntity(destructible);
      this.destructibles.push(destructible);
    }
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }

  public add(object: THREE.Object3D): void {
    this.scene.add(object);
  }

  public addEntity(entity: Entity): void {
    this.entities.push(entity);
    const object = entity.getObject();
    if (object) {
      this.scene.add(object);
    }
  }

  public removeEntity(entity: Entity): void {
    const index = this.entities.indexOf(entity);
    if (index !== -1) {
      this.entities.splice(index, 1);
      const object = entity.getObject();
      if (object) {
        this.scene.remove(object);
      }
    }
  }

  public update(deltaTime: number): void {
    // Update all entities
    for (const entity of this.entities) {
      entity.update(deltaTime);
    }

    // Update game time
    this.gameTime += deltaTime;

    // Update day/night cycle
    this.updateDayNightCycle(deltaTime);

    // Check for player interactions
    this.checkPlayerEntityInteractions();
  }

  private updateDayNightCycle(deltaTime: number): void {
    // Update time of day (cycles between 0 and 1)
    this.dayNightCycle.currentTimeOfDay =
      (this.gameTime % this.dayNightCycle.dayDuration) / this.dayNightCycle.dayDuration;

    // Adjust lighting based on time of day
    const timeOfDay = this.dayNightCycle.currentTimeOfDay;

    // Directional light (sun) position and intensity
    const sunAngle = timeOfDay * Math.PI * 2 - Math.PI / 2; // -90 degrees at midnight, 90 at noon
    const sunHeight = Math.sin(sunAngle);
    const sunDistance = 100;

    this.directionalLight.position.set(
      Math.cos(sunAngle) * sunDistance,
      Math.max(0, sunHeight) * 70 + 10, // Keep sun above horizon
      Math.sin(sunAngle + Math.PI / 4) * sunDistance
    );

    // Adjust light intensity based on time of day
    // Brightest at noon, darkest at midnight
    const sunIntensity = Math.max(0, Math.sin(sunAngle));
    this.directionalLight.intensity = 0.5 + sunIntensity * 0.5;

    // Adjust ambient light intensity
    this.ambientLight.intensity = 0.2 + sunIntensity * 0.3;

    // Adjust hemisphere light
    this.hemisphereLight.intensity = 0.3 + sunIntensity * 0.3;

    // Adjust sky color
    const isDay = sunHeight > 0;
    if (isDay) {
      // Day sky ranges from dawn/dusk orange to midday blue
      const dayProgress = Math.sin(sunAngle); // 0 at horizon, 1 at noon
      const skyColor = new THREE.Color();
      skyColor.r = 0.53 - dayProgress * 0.2;
      skyColor.g = 0.81 - dayProgress * 0.1;
      skyColor.b = 0.92 + dayProgress * 0.08;
      this.scene.background = skyColor;
    } else {
      // Night sky is dark blue
      const nightProgress = Math.abs(Math.sin(sunAngle)); // 0 at horizon, 1 at midnight
      const skyColor = new THREE.Color();
      skyColor.r = 0.05;
      skyColor.g = 0.05 + (1 - nightProgress) * 0.1;
      skyColor.b = 0.2 + (1 - nightProgress) * 0.2;
      this.scene.background = skyColor;
    }
  }

  private handlePlayerAttack = (event: CustomEvent): void => {
    if (!this.player) return;

    const { position, direction, power, radius } = event.detail;

    // Check for destructible objects within attack range
    for (const destructible of this.destructibles) {
      if (destructible.isDestroyedState()) continue;

      const destructiblePosition = destructible.getObject().position;
      const distance = position.distanceTo(destructiblePosition);

      if (distance < radius) {
        // Within attack range
        // Check if we're facing the destructible (dot product of direction vectors)
        const directionToDestructible = destructiblePosition.clone().sub(position).normalize();
        const dotProduct = direction.dot(directionToDestructible);

        // Only damage objects we're facing (dot product > 0.5 means within ~60 degree cone)
        if (dotProduct > 0.5) {
          const scoreValue = destructible.damage(power); // Apply damage

          // Play destruction sound if destroyed
          if (scoreValue > 0) {
            // Object was destroyed, add score and increase wanted level
            this.player.addScore(scoreValue);
            this.player.increaseWantedLevel();

            // Dispatch sound event
            this.dispatchSoundEvent("destruction", destructiblePosition);
          }
        }
      }
    }
  };

  private handlePlayerInteract = (event: CustomEvent): void => {
    if (!this.player) return;

    const { position, player } = event.detail;

    // Check for nearby vehicles the player could enter
    if (!player.isInAVehicle()) {
      const nearestVehicle = this.findNearestVehicle(position, 2);

      if (nearestVehicle) {
        // Enter the vehicle
        player.enterVehicle(nearestVehicle);

        // Dispatch sound event
        this.dispatchSoundEvent("vehicle_enter", position);

        console.log("Player entered vehicle");
      }
    }
  };

  private dispatchSoundEvent(soundId: string, position: THREE.Vector3): void {
    // Create and dispatch a custom event for the sound system
    const soundEvent = new CustomEvent("play-sound", {
      detail: {
        id: soundId,
        position: position.clone(),
        options: {},
      },
    });

    if (typeof window !== "undefined") {
      window.dispatchEvent(soundEvent);
    }
  }

  private checkPlayerEntityInteractions(): void {
    // This method is now simpler as we handle most interactions via events
    if (!this.player) return;

    // We can use this for showing UI prompts or other non-action checks
    const playerPosition = this.player.getObject().position;

    // Check for nearby interactable entities and show UI prompts if needed
    // ...
  }

  public getPlayer(): Player | null {
    return this.player;
  }

  public dispose(): void {
    // Remove event listeners
    if (typeof window !== "undefined") {
      window.removeEventListener("player-attack", this.handlePlayerAttack as EventListener);
      window.removeEventListener("player-interact", this.handlePlayerInteract as EventListener);
    }

    // Clean up resources and dispose of geometries/materials
    this.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (object.geometry) {
          object.geometry.dispose();
        }

        if (object.material) {
          if (Array.isArray(object.material)) {
            for (const material of object.material) {
              material.dispose();
            }
          } else {
            object.material.dispose();
          }
        }
      }
    });

    // Clear entities
    this.entities = [];
  }

  public getVehicles(): Vehicle[] {
    return this.vehicles;
  }

  public getDestructibles(): DestructibleObject[] {
    return this.destructibles;
  }

  public findNearestVehicle(position: THREE.Vector3, maxDistance = 10): Vehicle | null {
    let nearestVehicle: Vehicle | null = null;
    let nearestDistance = maxDistance;

    for (const vehicle of this.vehicles) {
      if (!vehicle.isOccupied()) {
        const distance = position.distanceTo(vehicle.getObject().position);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestVehicle = vehicle;
        }
      }
    }

    return nearestVehicle;
  }

  public getTimeOfDay(): number {
    return this.dayNightCycle.currentTimeOfDay;
  }
}
