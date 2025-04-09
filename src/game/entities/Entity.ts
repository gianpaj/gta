import type * as THREE from "three";

export interface Entity {
  update(deltaTime: number): void;
  getObject(): THREE.Object3D | null;
}
