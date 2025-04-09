import * as THREE from "three";

export class Camera {
  private camera: THREE.PerspectiveCamera;
  private cameraContainer: THREE.Object3D;
  private defaultHeight = 15;
  private minHeight = 8;
  private maxHeight = 25;
  private currentTargetPosition = new THREE.Vector3();

  constructor() {
    // Create a camera container to make manipulation easier
    this.cameraContainer = new THREE.Object3D();

    // Initialize the camera with good defaults for our top-down game
    this.camera = new THREE.PerspectiveCamera(
      60, // Field of view
      1, // Aspect ratio (will be updated in updateAspect)
      0.1, // Near clipping plane
      1000 // Far clipping plane
    );

    // Position the camera above and looking down
    this.camera.position.set(0, this.defaultHeight, 0);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.camera.rotation.z = 0; // Keep the camera level

    // Add the camera to its container
    this.cameraContainer.add(this.camera);

    // Initialize the container position
    this.cameraContainer.position.set(0, 0, 0);
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  public getObject(): THREE.Object3D {
    return this.cameraContainer;
  }

  public updateAspect(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  public setTarget(target: THREE.Vector3): void {
    this.currentTargetPosition.copy(target);
    this.cameraContainer.position.copy(target);
  }

  public setRotation(angle: number): void {
    this.cameraContainer.rotation.y = angle;
  }

  public setHeight(height: number): void {
    const clampedHeight = Math.max(this.minHeight, Math.min(height, this.maxHeight));
    this.camera.position.y = clampedHeight;
    this.camera.updateProjectionMatrix();
  }

  public update(deltaTime: number, targetPosition?: THREE.Vector3): void {
    // Implement smooth camera follow if target is provided
    if (targetPosition) {
      // Interpolate camera position towards target
      const lerpFactor = 1.0 - 0.1 ** deltaTime;
      this.currentTargetPosition.lerp(targetPosition, lerpFactor);
      this.cameraContainer.position.copy(this.currentTargetPosition);
    }
  }
}
