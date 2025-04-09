import * as THREE from "three";
import type { Entity } from "./Entity";

export enum VehicleType {
  CHARIOT = "chariot",
  CART = "cart",
}

export class Vehicle implements Entity {
  private object: THREE.Object3D;
  private mesh!: THREE.Mesh;
  private wheels: THREE.Mesh[] = [];
  private type: VehicleType;
  private speed = 0;
  private maxSpeed = 15;
  private acceleration = 5;
  private deceleration = 8;
  private turnSpeed = 1.5;
  private health = 100;
  private maxHealth = 100;
  private occupied = false;
  private driver: Entity | null = null;

  constructor(type: VehicleType = VehicleType.CHARIOT) {
    this.type = type;
    this.object = new THREE.Object3D();

    // Add userData for collision detection
    this.object.userData = { type: "vehicle" };

    // Create vehicle body based on type
    if (type === VehicleType.CHARIOT) {
      this.createChariot();
    } else {
      this.createCart();
    }
  }

  private createChariot(): void {
    // Create the main body of the chariot
    const bodyGeometry = new THREE.BoxGeometry(2, 0.5, 3);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    this.mesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    this.mesh.position.y = 0.5;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    // Add decorative elements to the chariot
    const frontDecoration = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.4, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xb8860b })
    );
    frontDecoration.position.set(0, 0.5, -1.4);
    this.mesh.add(frontDecoration);

    // Create the wheels
    this.createWheels(1.2, 0.6, 0);

    // Add the mesh to the object
    this.object.add(this.mesh);
  }

  private createCart(): void {
    // Create the main body of the cart
    const bodyGeometry = new THREE.BoxGeometry(2.2, 0.6, 4);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    this.mesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    this.mesh.position.y = 0.7;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    // Create the cargo area
    const cargoGeometry = new THREE.BoxGeometry(2, 1, 3);
    const cargoMaterial = new THREE.MeshStandardMaterial({ color: 0xa0522d });
    const cargo = new THREE.Mesh(cargoGeometry, cargoMaterial);
    cargo.position.set(0, 0.8, 0.2);
    this.mesh.add(cargo);

    // Create the wheels
    this.createWheels(1.4, 0.8, 1.2);

    // Add the mesh to the object
    this.object.add(this.mesh);
  }

  private createWheels(width: number, radius: number, zOffset: number): void {
    const wheelGeometry = new THREE.CylinderGeometry(radius, radius, 0.3, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });

    // Left front wheel
    const leftFrontWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    leftFrontWheel.rotation.z = Math.PI / 2;
    leftFrontWheel.position.set(-width, 0, -zOffset);
    this.object.add(leftFrontWheel);
    this.wheels.push(leftFrontWheel);

    // Right front wheel
    const rightFrontWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    rightFrontWheel.rotation.z = Math.PI / 2;
    rightFrontWheel.position.set(width, 0, -zOffset);
    this.object.add(rightFrontWheel);
    this.wheels.push(rightFrontWheel);

    // For cart, add rear wheels
    if (this.type === VehicleType.CART) {
      // Left rear wheel
      const leftRearWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      leftRearWheel.rotation.z = Math.PI / 2;
      leftRearWheel.position.set(-width, 0, -zOffset - 2.4);
      this.object.add(leftRearWheel);
      this.wheels.push(leftRearWheel);

      // Right rear wheel
      const rightRearWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      rightRearWheel.rotation.z = Math.PI / 2;
      rightRearWheel.position.set(width, 0, -zOffset - 2.4);
      this.object.add(rightRearWheel);
      this.wheels.push(rightRearWheel);
    }
  }

  public getObject(): THREE.Object3D {
    return this.object;
  }

  public update(deltaTime: number): void {
    // Apply deceleration
    if (this.speed > 0) {
      this.speed = Math.max(0, this.speed - this.deceleration * deltaTime);
    } else if (this.speed < 0) {
      this.speed = Math.min(0, this.speed + this.deceleration * deltaTime);
    }

    // Update position based on speed
    const moveDistance = this.speed * deltaTime;
    this.object.translateZ(-moveDistance);

    // Animate wheels based on speed
    this.animateWheels(deltaTime);
  }

  private animateWheels(deltaTime: number): void {
    // Rotate wheels based on speed
    const wheelRotation = this.speed * deltaTime * 0.5;
    for (const wheel of this.wheels) {
      wheel.rotation.x += wheelRotation;
    }
  }

  public accelerate(deltaTime: number): void {
    this.speed = Math.min(this.maxSpeed, this.speed + this.acceleration * deltaTime);
  }

  public brake(deltaTime: number): void {
    this.speed = Math.max(-this.maxSpeed / 2, this.speed - this.acceleration * 2 * deltaTime);
  }

  public turn(direction: number, deltaTime: number): void {
    // Only allow turning if the vehicle is moving
    if (Math.abs(this.speed) > 0.5) {
      const turnAmount = direction * this.turnSpeed * deltaTime * (this.speed / this.maxSpeed);
      this.object.rotation.y += turnAmount;
    }
  }

  public enterVehicle(entity: Entity): boolean {
    if (!this.occupied) {
      this.occupied = true;
      this.driver = entity;
      return true;
    }
    return false;
  }

  public exitVehicle(): Entity | null {
    if (this.occupied && this.driver) {
      this.occupied = false;
      const driver = this.driver;
      this.driver = null;

      // Position the driver next to the vehicle
      const exitPosition = new THREE.Vector3(2, 0, 0);
      exitPosition.applyMatrix4(this.object.matrixWorld);
      driver.getObject()?.position.copy(exitPosition);

      return driver;
    }
    return null;
  }

  public damage(amount: number): void {
    this.health = Math.max(0, this.health - amount);

    // If completely destroyed
    if (this.health <= 0) {
      // Force driver to exit if present
      this.exitVehicle();

      // Show damage by changing color
      if (this.mesh.material instanceof THREE.MeshStandardMaterial) {
        this.mesh.material.color.set(0x333333);
      }
    }
  }

  public repair(amount: number): void {
    this.health = Math.min(this.maxHealth, this.health + amount);

    // Show repair by restoring color
    if (this.health > 0 && this.mesh.material instanceof THREE.MeshStandardMaterial) {
      if (this.type === VehicleType.CHARIOT) {
        this.mesh.material.color.set(0x8b4513);
      } else {
        this.mesh.material.color.set(0x8b4513);
      }
    }
  }

  public isOccupied(): boolean {
    return this.occupied;
  }

  public getHealth(): number {
    return this.health;
  }

  public getHealthPercent(): number {
    return (this.health / this.maxHealth) * 100;
  }

  public getSpeed(): number {
    return this.speed;
  }

  public getSpeedPercent(): number {
    return (Math.abs(this.speed) / this.maxSpeed) * 100;
  }

  public getType(): VehicleType {
    return this.type;
  }

  public dispose(): void {
    // Dispose of geometries and materials
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

    // Dispose wheel resources
    for (const wheel of this.wheels) {
      if (wheel.geometry) {
        wheel.geometry.dispose();
      }

      if (wheel.material) {
        if (Array.isArray(wheel.material)) {
          for (const material of wheel.material) {
            material.dispose();
          }
        } else {
          wheel.material.dispose();
        }
      }
    }
  }
}
