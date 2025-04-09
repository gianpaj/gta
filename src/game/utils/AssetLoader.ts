import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

type AssetType = "texture" | "model" | "audio";

interface AssetDefinition {
  id: string;
  type: AssetType;
  url: string;
}

export class AssetLoader {
  private textureLoader: THREE.TextureLoader;
  private gltfLoader: GLTFLoader;
  private dracoLoader: DRACOLoader;
  private loadingManager: THREE.LoadingManager;

  private textures: Map<string, THREE.Texture> = new Map();
  private models: Map<string, GLTF> = new Map();

  constructor() {
    this.loadingManager = new THREE.LoadingManager();

    // Set up texture loader
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);

    // Set up GLTF loader with Draco compression support
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath("/draco/");

    this.gltfLoader = new GLTFLoader(this.loadingManager);
    this.gltfLoader.setDRACOLoader(this.dracoLoader);

    // Configure loading manager
    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = (itemsLoaded / itemsTotal) * 100;
      console.log(`Loading: ${progress.toFixed(2)}% (${itemsLoaded}/${itemsTotal})`);
    };
  }

  public async loadInitialAssets(): Promise<void> {
    const initialAssets: AssetDefinition[] = [
      // Define initial assets here
      // Example: { id: 'player_model', type: 'model', url: '/models/player.glb' }
    ];

    await this.loadAssets(initialAssets);
  }

  public async loadAssets(assets: AssetDefinition[]): Promise<void> {
    const promises = assets.map((asset) => this.loadAsset(asset));
    await Promise.all(promises);
  }

  private async loadAsset(asset: AssetDefinition): Promise<void> {
    switch (asset.type) {
      case "texture":
        await this.loadTexture(asset.id, asset.url);
        break;
      case "model":
        await this.loadModel(asset.id, asset.url);
        break;
      case "audio":
        // Audio loading will be handled by Howler.js in a separate audio manager
        break;
    }
  }

  private loadTexture(id: string, url: string): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        url,
        (texture) => {
          this.textures.set(id, texture);
          resolve(texture);
        },
        undefined,
        (error) => {
          console.error(`Error loading texture ${id} from ${url}:`, error);
          reject(error);
        }
      );
    });
  }

  private loadModel(id: string, url: string): Promise<GLTF> {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          this.models.set(id, gltf);
          resolve(gltf);
        },
        undefined,
        (error) => {
          console.error(`Error loading model ${id} from ${url}:`, error);
          reject(error);
        }
      );
    });
  }

  public getTexture(id: string): THREE.Texture | undefined {
    return this.textures.get(id);
  }

  public getModel(id: string): GLTF | undefined {
    return this.models.get(id);
  }

  public disposeAssets(): void {
    // Dispose textures
    for (const texture of this.textures.values()) {
      texture.dispose();
    }
    this.textures.clear();

    // Clear models (three.js will handle disposal of geometries/materials)
    this.models.clear();

    // Dispose Draco loader
    this.dracoLoader.dispose();
  }
}
