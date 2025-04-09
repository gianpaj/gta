import * as THREE from "three";
import type { Entity } from "./Entity";
import type { Vehicle } from "./Vehicle";

export class Player implements Entity {
  private object: THREE.Object3D;
  private mesh: THREE.Mesh;
  private speed = 10;
  private moveDirection = new THREE.Vector3();
  private rotationSpeed = 2;
  private targetRotation = 0;
  private currentVehicle: Vehicle | null = null;
  private isInVehicle = false;
  private health = 100;
  private maxHealth = 100;
  private isAttacking = false;
  private attackCooldown = 0;
  private attackDuration = 0.3;
  private attackCooldownTime = 0.5;
  private attackPower = 20;
  private attackRadius = 2;
  private wantedLevel = 0;
  private score = 0;
  private collisionRadius = 0.5; // Radius for collision detection

  // Input state
  private keys = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    attack: false,
    interact: false,
  };

  constructor() {
    // Create a placeholder model for the player
    this.object = new THREE.Object3D();

    // Create a simple mesh for the player character
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1.8, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0xf5d264 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.y = 0.9; // Half height to place on ground
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    // Add the mesh to the object
    this.object.add(this.mesh);

    // Set up input handlers
    this.setupInput();
  }

  public getObject(): THREE.Object3D {
    return this.object;
  }

  private setupInput(): void {
    // Only add events if we're in the browser
    if (typeof window !== "undefined") {
      // Keyboard events
      window.addEventListener("keydown", this.handleKeyDown);
      window.addEventListener("keyup", this.handleKeyUp);
    }
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    switch (event.key) {
      case "w":
      case "ArrowUp":
        this.keys.forward = true;
        break;
      case "s":
      case "ArrowDown":
        this.keys.backward = true;
        break;
      case "a":
      case "ArrowLeft":
        this.keys.left = true;
        break;
      case "d":
      case "ArrowRight":
        this.keys.right = true;
        break;
      case " ": // Spacebar for attack
        this.keys.attack = true;
        this.tryAttack();
        break;
      case "e": // E for interaction
        this.keys.interact = true;
        this.tryInteract();
        break;
    }
  };

  private handleKeyUp = (event: KeyboardEvent): void => {
    switch (event.key) {
      case "w":
      case "ArrowUp":
        this.keys.forward = false;
        break;
      case "s":
      case "ArrowDown":
        this.keys.backward = false;
        break;
      case "a":
      case "ArrowLeft":
        this.keys.left = false;
        break;
      case "d":
      case "ArrowRight":
        this.keys.right = false;
        break;
      case " ": // Spacebar for attack
        this.keys.attack = false;
        break;
      case "e": // E for interaction
        this.keys.interact = false;
        break;
    }
  };

  public update(deltaTime: number): void {
    if (this.isInVehicle && this.currentVehicle) {
      // Update vehicle controls
      this.updateVehicleControls(deltaTime);
    } else {
      // Process input and update movement
      this.updateMovement(deltaTime);

      // Update player rotation to face movement direction
      this.updateRotation(deltaTime);
    }

    // Update attack cooldown
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;

      // End of attack animation
      if (this.attackCooldown <= this.attackCooldownTime - this.attackDuration && this.isAttacking) {
        this.isAttacking = false;
        this.resetAttackAnimation();
      }
    }
  }

  private updateMovement(deltaTime: number): void {
    // Reset movement direction
    this.moveDirection.set(0, 0, 0);

    // Apply movement based on input
    if (this.keys.forward) {
      this.moveDirection.z -= 1;
    }
    if (this.keys.backward) {
      this.moveDirection.z += 1;
    }
    if (this.keys.left) {
      this.moveDirection.x -= 1;
    }
    if (this.keys.right) {
      this.moveDirection.x += 1;
    }

    // Normalize the vector to ensure consistent speed in all directions
    if (this.moveDirection.length() > 0) {
      this.moveDirection.normalize();

      // Calculate target rotation based on movement direction
      this.targetRotation = Math.atan2(this.moveDirection.x, this.moveDirection.z);
    }

    // Apply speed and delta time
    this.moveDirection.multiplyScalar(this.speed * deltaTime);

    // Store current position before movement
    const oldPosition = this.object.position.clone();

    // Calculate new position
    const newPosition = oldPosition.clone().add(this.moveDirection);

    // Check for collisions
    if (!this.checkCollision(newPosition)) {
      // No collision, update position
      this.object.position.copy(newPosition);
    } else {
      // Attempt to slide along obstacles
      this.trySlideMovement(oldPosition, newPosition);
    }
  }

  private updateRotation(deltaTime: number): void {
    // Interpolate current rotation to target rotation
    if (this.moveDirection.length() > 0) {
      const currentRotation = this.object.rotation.y;
      let angleDiff = this.targetRotation - currentRotation;

      // Ensure we rotate the shortest way
      if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      // Apply rotation with smooth interpolation
      this.object.rotation.y += angleDiff * this.rotationSpeed * deltaTime;
    }
  }

  private updateVehicleControls(deltaTime: number): void {
    if (!this.currentVehicle) return;

    // Accelerate/brake vehicle
    if (this.keys.forward) {
      this.currentVehicle.accelerate(deltaTime);
    }
    if (this.keys.backward) {
      this.currentVehicle.brake(deltaTime);
    }

    // Turn vehicle
    let turnDirection = 0;
    if (this.keys.left) turnDirection -= 1;
    if (this.keys.right) turnDirection += 1;

    if (turnDirection !== 0) {
      this.currentVehicle.turn(turnDirection, deltaTime);
    }
  }

  private tryAttack(): void {
    // Check if attack is on cooldown
    if (this.attackCooldown > 0 || this.isInVehicle) return;

    // Start attack
    this.isAttacking = true;
    this.attackCooldown = this.attackCooldownTime;

    // Play attack animation
    this.playAttackAnimation();

    // Dispatch an event that the scene can listen to
    const attackEvent = new CustomEvent("player-attack", {
      detail: {
        position: this.object.position.clone(),
        direction: new THREE.Vector3(0, 0, -1).applyQuaternion(this.object.quaternion),
        power: this.attackPower,
        radius: this.attackRadius,
      },
    });

    // Play attack sound
    const soundEvent = new CustomEvent("play-sound", {
      detail: {
        id: "attack",
        position: this.object.position.clone(),
        options: {},
      },
    });

    // Dispatch the events if in browser
    if (typeof window !== "undefined") {
      window.dispatchEvent(attackEvent);
      window.dispatchEvent(soundEvent);
    }

    // Console log for debugging
    console.log("Player attacked!");
  }

  private playAttackAnimation(): void {
    // Simple attack animation by scaling the player mesh
    if (this.mesh) {
      const initialScale = this.mesh.scale.clone();
      this.mesh.scale.set(initialScale.x * 1.2, initialScale.y, initialScale.z * 1.2);

      // Create a simple "weapon swing" effect
      const swingGeometry = new THREE.BoxGeometry(1.5, 0.2, 0.2);
      const swingMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
      const swingMesh = new THREE.Mesh(swingGeometry, swingMaterial);
      swingMesh.position.set(0, 1, 1);
      swingMesh.name = "attackSwing";
      this.object.add(swingMesh);

      // Remove the swing effect after the attack duration
      setTimeout(() => {
        this.object.remove(swingMesh);
        swingMesh.geometry.dispose();
        swingMaterial.dispose();
      }, this.attackDuration * 1000);
    }
  }

  private resetAttackAnimation(): void {
    // Reset the mesh scale after attack
    if (this.mesh) {
      this.mesh.scale.set(1, 1, 1);
    }
  }

  private tryInteract(): void {
    // Check if already in a vehicle
    if (this.isInVehicle && this.currentVehicle) {
      // Exit the vehicle
      this.exitVehicle();
    } else {
      // Try to find a vehicle nearby to enter
      // Dispatch an interaction event that the scene can handle
      const interactEvent = new CustomEvent("player-interact", {
        detail: {
          position: this.object.position.clone(),
          player: this,
        },
      });

      // Dispatch the event if in browser
      if (typeof window !== "undefined") {
        window.dispatchEvent(interactEvent);
      }

      console.log("Looking for something to interact with");
    }
  }

  private findAndEnterNearbyVehicle(): void {
    // This method is no longer needed as interaction is handled via events
  }

  public enterVehicle(vehicle: Vehicle): void {
    if (vehicle.enterVehicle(this)) {
      this.isInVehicle = true;
      this.currentVehicle = vehicle;

      // Hide the player mesh
      this.mesh.visible = false;

      console.log("Entered vehicle");
    }
  }

  private exitVehicle(): void {
    if (!this.currentVehicle) return;

    const exitedVehicle = this.currentVehicle.exitVehicle();
    if (exitedVehicle) {
      this.isInVehicle = false;
      this.currentVehicle = null;

      // Show the player mesh
      this.mesh.visible = true;

      // Play exit sound
      const soundEvent = new CustomEvent("play-sound", {
        detail: {
          id: "vehicle_exit",
          position: this.object.position.clone(),
          options: {},
        },
      });

      if (typeof window !== "undefined") {
        window.dispatchEvent(soundEvent);
      }

      console.log("Exited vehicle");
    }
  }

  public damage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
    if (this.health <= 0) {
      // Player death logic would go here
      console.log("Player died!");
    }
  }

  public heal(amount: number): void {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  public increaseWantedLevel(): void {
    this.wantedLevel = Math.min(5, this.wantedLevel + 1);
    console.log(`Wanted level increased to ${this.wantedLevel}`);
  }

  public decreaseWantedLevel(): void {
    this.wantedLevel = Math.max(0, this.wantedLevel - 1);
    console.log(`Wanted level decreased to ${this.wantedLevel}`);
  }

  public addScore(points: number): void {
    this.score += points;
  }

  public getScore(): number {
    return this.score;
  }

  public getWantedLevel(): number {
    return this.wantedLevel;
  }

  public getHealth(): number {
    return this.health;
  }

  public getHealthPercent(): number {
    return (this.health / this.maxHealth) * 100;
  }

  public isInAVehicle(): boolean {
    return this.isInVehicle;
  }

  public getCurrentVehicle(): Vehicle | null {
    return this.currentVehicle;
  }

  public getAttackingState(): boolean {
    return this.isAttacking;
  }

  public dispose(): void {
    if (typeof window !== "undefined") {
      window.removeEventListener("keydown", this.handleKeyDown);
      window.removeEventListener("keyup", this.handleKeyUp);
    }

    // Dispose geometries and materials
    if (this.mesh.geometry) {
      this.mesh.geometry.dispose();
    }

    if (this.mesh.material) {
      if (Array.isArray(this.mesh.material)) {
        for (const material of this.mesh.material) {
          material.dispose();
        }
      } else {
        this.mesh.material.dispose();
      }
    }
  }

  private checkCollision(position: THREE.Vector3): boolean {
    // Get all scene objects to check against
    const sceneObjects = this.getSceneObjects();
    if (sceneObjects.length === 0) return false;

    // Cast rays in multiple directions to detect walls/obstacles
    const playerHeight = 0.9; // Approximate player height center
    const rayDirections = [
      new THREE.Vector3(1, 0, 0), // Right
      new THREE.Vector3(-1, 0, 0), // Left
      new THREE.Vector3(0, 0, 1), // Forward
      new THREE.Vector3(0, 0, -1), // Backward
      new THREE.Vector3(1, 0, 1).normalize(), // Diagonal forward-right
      new THREE.Vector3(-1, 0, 1).normalize(), // Diagonal forward-left
      new THREE.Vector3(1, 0, -1).normalize(), // Diagonal backward-right
      new THREE.Vector3(-1, 0, -1).normalize(), // Diagonal backward-left
    ];

    // Calculate movement direction for targeted ray
    const movementDirection = position.clone().sub(this.object.position).normalize();

    // Start position for rays (at player's center)
    const rayStart = new THREE.Vector3().copy(this.object.position).setY(this.object.position.y + playerHeight);

    // Create a raycaster
    const raycaster = new THREE.Raycaster();

    // First, check in movement direction with more precision
    raycaster.set(rayStart, movementDirection);
    raycaster.far = this.collisionRadius + this.moveDirection.length() * 1.1; // Slightly more than movement distance

    let collisions = raycaster.intersectObjects(sceneObjects, true);
    if (collisions.length > 0) {
      return true;
    }

    // Check in all predefined directions with a slightly smaller radius
    // This prevents the player from getting stuck on the edges
    const checkRadius = this.collisionRadius * 0.9;

    for (const direction of rayDirections) {
      raycaster.set(rayStart, direction);
      raycaster.far = checkRadius;

      collisions = raycaster.intersectObjects(sceneObjects, true);
      if (collisions.length > 0) {
        // If any ray hits something, we're colliding
        return true;
      }
    }

    // No collisions found
    return false;
  }

  private getSceneObjects(): THREE.Object3D[] {
    // Get all scene objects excluding the player and ground
    const scene = this.object.parent;
    if (!scene) return [];

    return Array.from(scene.children).filter((obj) => {
      // Exclude the player itself, ground plane, and grid
      const isPlayer = obj === this.object;
      const isGround = obj instanceof THREE.Mesh && obj.geometry instanceof THREE.PlaneGeometry;
      const isGrid = obj instanceof THREE.GridHelper;

      // Check if it's a collidable object
      const isCollidable = this.isObjectCollidable(obj);

      return !isPlayer && !isGround && !isGrid && isCollidable;
    });
  }

  private isObjectCollidable(obj: THREE.Object3D): boolean {
    // Buildings (boxes) are always collidable
    if (obj instanceof THREE.Mesh && obj.geometry instanceof THREE.BoxGeometry) {
      return true;
    }

    // Check if it's a vehicle (but not the one we're in)
    if (this.isInVehicle && this.currentVehicle && obj === this.currentVehicle.getObject()) {
      return false; // Don't collide with our own vehicle
    }

    // Check if it's a Vehicle instance based on userData
    if (obj.userData && obj.userData.type === "vehicle") {
      return true;
    }

    // Check if it's a DestructibleObject that's not destroyed
    if (obj.userData && obj.userData.type === "destructible" && !obj.userData.destroyed) {
      return true;
    }

    // Default to collidable for objects with certain geometries that are likely walls or obstacles
    if (obj instanceof THREE.Mesh) {
      const geo = obj.geometry;
      return (
        geo instanceof THREE.BoxGeometry || geo instanceof THREE.CylinderGeometry || geo instanceof THREE.TorusGeometry
      );
    }

    return false;
  }

  private trySlideMovement(oldPosition: THREE.Vector3, newPosition: THREE.Vector3): void {
    // Calculate separate X and Z movements
    const xMove = newPosition.x - oldPosition.x;
    const zMove = newPosition.z - oldPosition.z;

    // Try sliding along X axis first
    const xSlidePosition = new THREE.Vector3(oldPosition.x + xMove, oldPosition.y, oldPosition.z);
    if (!this.checkCollision(xSlidePosition)) {
      this.object.position.copy(xSlidePosition);
      return;
    }

    // Try sliding along Z axis next
    const zSlidePosition = new THREE.Vector3(oldPosition.x, oldPosition.y, oldPosition.z + zMove);
    if (!this.checkCollision(zSlidePosition)) {
      this.object.position.copy(zSlidePosition);
      return;
    }

    // Both direct slides failed, try moving a smaller amount (for tight spaces)
    // Try multiple step sizes to help the player navigate tight spaces
    const stepSizes = [0.75, 0.5, 0.25];

    for (const stepSize of stepSizes) {
      // Try partial X movement
      const partialXPosition = new THREE.Vector3(oldPosition.x + xMove * stepSize, oldPosition.y, oldPosition.z);
      if (!this.checkCollision(partialXPosition)) {
        this.object.position.copy(partialXPosition);
        return;
      }

      // Try partial Z movement
      const partialZPosition = new THREE.Vector3(oldPosition.x, oldPosition.y, oldPosition.z + zMove * stepSize);
      if (!this.checkCollision(partialZPosition)) {
        this.object.position.copy(partialZPosition);
        return;
      }

      // Try combined partial movement
      const partialCombinedPosition = new THREE.Vector3(
        oldPosition.x + xMove * stepSize,
        oldPosition.y,
        oldPosition.z + zMove * stepSize
      );
      if (!this.checkCollision(partialCombinedPosition)) {
        this.object.position.copy(partialCombinedPosition);
        return;
      }
    }

    // If we get here, try to slightly push the player away from the collision
    // This helps prevent getting stuck in corners
    const pushBackPosition = this.calculatePushBackPosition(oldPosition);
    if (pushBackPosition && !this.checkCollision(pushBackPosition)) {
      this.object.position.copy(pushBackPosition);
      return;
    }

    // If all else fails, stay in the old position
  }

  private calculatePushBackPosition(position: THREE.Vector3): THREE.Vector3 | null {
    // Get scene objects to check distance against
    const sceneObjects = this.getSceneObjects();
    if (sceneObjects.length === 0) return null;

    // Find the closest object
    let closestObject: THREE.Object3D | null = null;
    let closestDistance = Number.MAX_VALUE;

    for (const obj of sceneObjects) {
      const distance = position.distanceTo(obj.position);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestObject = obj;
      }
    }

    if (!closestObject) return null;

    // Calculate direction away from closest object
    const directionAway = position.clone().sub(closestObject.position).normalize();

    // Create a small push back (10% of collision radius)
    return position.clone().add(directionAway.multiplyScalar(this.collisionRadius * 0.2));
  }
}
