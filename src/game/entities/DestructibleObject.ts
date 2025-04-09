import * as THREE from "three";
import type { Entity } from "./Entity";

export enum DestructibleType {
  BARREL = "barrel",
  STALL = "stall",
  CRATE = "crate",
  POT = "pot",
  FENCE = "fence",
}

export class DestructibleObject implements Entity {
  private object: THREE.Object3D;
  private mesh!: THREE.Object3D;
  private initialScale!: THREE.Vector3;
  private type: DestructibleType;
  private health!: number;
  private maxHealth!: number;
  private isDestroyed = false;
  private scoreValue = 10;
  private wantedLevelIncrease = 0.2;
  private debrisParticles: THREE.Points | null = null;

  constructor(type: DestructibleType, position: THREE.Vector3) {
    this.type = type;
    this.object = new THREE.Object3D();
    this.object.position.copy(position);

    // Add userData for collision detection
    this.object.userData = { type: "destructible", destroyed: false };

    // Configure properties based on type
    switch (type) {
      case DestructibleType.BARREL:
        this.maxHealth = 50;
        this.scoreValue = 10;
        this.createBarrel();
        break;
      case DestructibleType.STALL:
        this.maxHealth = 120;
        this.scoreValue = 50;
        this.wantedLevelIncrease = 0.5;
        this.createStall();
        break;
      case DestructibleType.CRATE:
        this.maxHealth = 30;
        this.scoreValue = 5;
        this.createCrate();
        break;
      case DestructibleType.POT:
        this.maxHealth = 10;
        this.scoreValue = 2;
        this.createPot();
        break;
      case DestructibleType.FENCE:
        this.maxHealth = 80;
        this.scoreValue = 15;
        this.createFence();
        break;
    }

    this.health = this.maxHealth;
    this.initialScale = this.mesh.scale.clone();
  }

  private createBarrel(): void {
    // Create barrel geometry
    const geometry = new THREE.CylinderGeometry(0.4, 0.4, 1, 12);
    const material = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
      roughness: 0.8,
      metalness: 0.2,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.y = 0.5; // Half height to place on ground
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    // Add decorative bands around barrel
    const bandGeometry = new THREE.TorusGeometry(0.41, 0.05, 8, 16);
    const bandMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3520 });

    const topBand = new THREE.Mesh(bandGeometry, bandMaterial);
    topBand.rotation.x = Math.PI / 2;
    topBand.position.y = 0.3;
    this.mesh.add(topBand);

    const bottomBand = new THREE.Mesh(bandGeometry, bandMaterial);
    bottomBand.rotation.x = Math.PI / 2;
    bottomBand.position.y = -0.3;
    this.mesh.add(bottomBand);

    // Add the mesh to the object
    this.object.add(this.mesh);
  }

  private createStall(): void {
    // Create stall base
    const baseGeometry = new THREE.BoxGeometry(3, 0.1, 2);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.05;
    base.castShadow = true;
    base.receiveShadow = true;

    // Create counter
    const counterGeometry = new THREE.BoxGeometry(3, 0.6, 0.6);
    const counterMaterial = new THREE.MeshStandardMaterial({ color: 0xa0522d });
    const counter = new THREE.Mesh(counterGeometry, counterMaterial);
    counter.position.set(0, 0.3, 0.7);
    counter.castShadow = true;
    counter.receiveShadow = true;

    // Create canopy
    const canopyGeometry = new THREE.BoxGeometry(3.2, 0.05, 2.2);
    const canopyMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f5dc });
    const canopy = new THREE.Mesh(canopyGeometry, canopyMaterial);
    canopy.position.y = 2;
    canopy.castShadow = true;
    canopy.receiveShadow = true;

    // Create poles
    const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

    const pole1 = new THREE.Mesh(poleGeometry, poleMaterial);
    pole1.position.set(-1.4, 1, -0.9);
    pole1.castShadow = true;

    const pole2 = new THREE.Mesh(poleGeometry, poleMaterial);
    pole2.position.set(1.4, 1, -0.9);
    pole2.castShadow = true;

    // Create a group for the stall
    const stallGroup = new THREE.Group();
    stallGroup.add(base);
    stallGroup.add(counter);
    stallGroup.add(canopy);
    stallGroup.add(pole1);
    stallGroup.add(pole2);

    this.mesh = stallGroup;

    // Add the mesh to the object
    this.object.add(this.mesh);
  }

  private createCrate(): void {
    // Create crate geometry
    const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const material = new THREE.MeshStandardMaterial({
      color: 0xa0522d,
      roughness: 0.9,
      metalness: 0.1,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.y = 0.4; // Half height to place on ground
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    // Add the mesh to the object
    this.object.add(this.mesh);
  }

  private createPot(): void {
    // Create pot geometry
    const geometry = new THREE.CylinderGeometry(0.2, 0.3, 0.6, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0xcd853f,
      roughness: 0.9,
      metalness: 0.1,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.y = 0.3; // Half height to place on ground
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    // Add the mesh to the object
    this.object.add(this.mesh);
  }

  private createFence(): void {
    // Create fence posts
    const postGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
    const postMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

    // Create horizontal planks
    const plankGeometry = new THREE.BoxGeometry(2, 0.15, 0.05);
    const plankMaterial = new THREE.MeshStandardMaterial({ color: 0xa0522d });

    // Create a fence section
    const fenceGroup = new THREE.Group();

    // Add posts
    const leftPost = new THREE.Mesh(postGeometry, postMaterial);
    leftPost.position.set(-1, 0.5, 0);
    leftPost.castShadow = true;
    fenceGroup.add(leftPost);

    const rightPost = new THREE.Mesh(postGeometry, postMaterial);
    rightPost.position.set(1, 0.5, 0);
    rightPost.castShadow = true;
    fenceGroup.add(rightPost);

    // Add planks
    const topPlank = new THREE.Mesh(plankGeometry, plankMaterial);
    topPlank.position.set(0, 0.8, 0);
    topPlank.castShadow = true;
    fenceGroup.add(topPlank);

    const middlePlank = new THREE.Mesh(plankGeometry, plankMaterial);
    middlePlank.position.set(0, 0.5, 0);
    middlePlank.castShadow = true;
    fenceGroup.add(middlePlank);

    const bottomPlank = new THREE.Mesh(plankGeometry, plankMaterial);
    bottomPlank.position.set(0, 0.2, 0);
    bottomPlank.castShadow = true;
    fenceGroup.add(bottomPlank);

    this.mesh = fenceGroup;

    // Add the mesh to the object
    this.object.add(this.mesh);
  }

  public getObject(): THREE.Object3D {
    return this.object;
  }

  public update(deltaTime: number): void {
    // If destroyed, update any destruction effects (e.g. particles)
    if (this.isDestroyed && this.debrisParticles) {
      // Update debris particles (e.g., make them fall)
      const particlePositions = this.debrisParticles.geometry.attributes.position;
      const velocities = (this.debrisParticles.userData.velocities || []) as THREE.Vector3[];

      for (let i = 0; i < particlePositions.count; i++) {
        // Apply gravity to y component
        velocities[i].y -= 9.8 * deltaTime;

        // Update position
        const x = particlePositions.getX(i) + velocities[i].x * deltaTime;
        const y = particlePositions.getY(i) + velocities[i].y * deltaTime;
        const z = particlePositions.getZ(i) + velocities[i].z * deltaTime;

        particlePositions.setXYZ(i, x, y, z);
      }

      particlePositions.needsUpdate = true;

      // Remove particles once they've fallen below ground level
      let allParticlesBelowGround = true;
      for (let i = 0; i < particlePositions.count; i++) {
        if (particlePositions.getY(i) > -5) {
          allParticlesBelowGround = false;
          break;
        }
      }

      if (allParticlesBelowGround) {
        // Clean up particles
        this.object.remove(this.debrisParticles);
        this.debrisParticles.geometry.dispose();
        if (this.debrisParticles.material instanceof THREE.Material) {
          this.debrisParticles.material.dispose();
        } else {
          for (const material of this.debrisParticles.material) {
            material.dispose();
          }
        }
        this.debrisParticles = null;
      }
    }
  }

  public damage(amount: number): number {
    // Only process damage if not already destroyed
    if (this.isDestroyed) return 0;

    // Apply damage
    this.health -= amount;

    // Visual feedback for damage (slight scaling down)
    const damageRatio = this.health / this.maxHealth;
    const scaleModifier = 0.9 + 0.1 * damageRatio;
    this.mesh.scale.set(
      this.initialScale.x * scaleModifier,
      this.initialScale.y * scaleModifier,
      this.initialScale.z * scaleModifier
    );

    // Change material color slightly to show damage
    if (this.mesh instanceof THREE.Mesh && this.mesh.material instanceof THREE.MeshStandardMaterial) {
      const hsl: THREE.HSL = { h: 0, s: 0, l: 0 };
      this.mesh.material.color.getHSL(hsl);
      this.mesh.material.color.setHSL(hsl.h, hsl.s, Math.max(0.2, hsl.l * damageRatio));
    }

    // Check if destroyed
    if (this.health <= 0) {
      this.destroy();
      return this.scoreValue;
    }

    return 0;
  }

  private destroy(): void {
    this.isDestroyed = true;

    // Update userData for collision detection
    this.object.userData.destroyed = true;

    // Hide the original mesh
    this.mesh.visible = false;

    // Create debris particles
    this.createDebrisEffect();

    // Optionally play sound effect, handled by audio manager
    // audioManager.playSound('destruction', this.object.position);
  }

  private createDebrisEffect(): void {
    // Create a particle system for debris
    const particleCount = 20 + Math.floor(Math.random() * 20);
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities: THREE.Vector3[] = [];

    // Determine particle color based on object type
    let baseColor = new THREE.Color(0x8b4513); // Default wood brown
    if (this.mesh instanceof THREE.Mesh && this.mesh.material instanceof THREE.MeshStandardMaterial) {
      baseColor = this.mesh.material.color;
    }

    // Generate random particle positions within the object bounds
    const particleSize = this.type === DestructibleType.STALL ? 0.2 : 0.05;
    const bounds = new THREE.Box3().setFromObject(this.mesh);
    const size = new THREE.Vector3();
    bounds.getSize(size);

    for (let i = 0; i < particleCount; i++) {
      // Position within bounds
      const x = bounds.min.x + Math.random() * size.x;
      const y = bounds.min.y + Math.random() * size.y;
      const z = bounds.min.z + Math.random() * size.z;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Slightly vary color
      const colorVariation = 0.1;
      const color = baseColor.clone();
      color.r += (Math.random() - 0.5) * colorVariation;
      color.g += (Math.random() - 0.5) * colorVariation;
      color.b += (Math.random() - 0.5) * colorVariation;

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Add random velocity
      const velocity = new THREE.Vector3((Math.random() - 0.5) * 2, Math.random() * 5, (Math.random() - 0.5) * 2);
      velocities.push(velocity);
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: particleSize,
      vertexColors: true,
      sizeAttenuation: true,
    });

    this.debrisParticles = new THREE.Points(particleGeometry, particleMaterial);
    this.debrisParticles.userData.velocities = velocities;
    this.object.add(this.debrisParticles);
  }

  public getScoreValue(): number {
    return this.scoreValue;
  }

  public getWantedLevelIncrease(): number {
    return this.wantedLevelIncrease;
  }

  public isDestroyedState(): boolean {
    return this.isDestroyed;
  }

  public getType(): DestructibleType {
    return this.type;
  }

  public dispose(): void {
    // Dispose of all geometries and materials
    if (this.mesh instanceof THREE.Mesh) {
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
    } else if (this.mesh instanceof THREE.Group) {
      // Dispose of all children if mesh is a group
      this.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) {
            child.geometry.dispose();
          }

          if (child.material) {
            if (Array.isArray(child.material)) {
              for (const material of child.material) {
                material.dispose();
              }
            } else {
              child.material.dispose();
            }
          }
        }
      });
    }

    // Dispose of debris particles if they exist
    if (this.debrisParticles) {
      this.debrisParticles.geometry.dispose();
      if (this.debrisParticles.material instanceof THREE.Material) {
        this.debrisParticles.material.dispose();
      } else if (Array.isArray(this.debrisParticles.material)) {
        for (const material of this.debrisParticles.material) {
          material.dispose();
        }
      }
    }
  }
}
