// We'll use Howler.js for audio management
// This would be installed via npm install howler
// import { Howl, Howler } from 'howler';

export class SoundSystem {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private music: HTMLAudioElement | null = null;
  private musicVolume = 0.5;
  private sfxVolume = 0.7;
  private isMuted = false;

  constructor() {
    this.preloadSounds();

    // Set up event listeners
    if (typeof window !== "undefined") {
      // Add a global mute toggle with the 'M' key
      window.addEventListener("keydown", this.handleKeyDown);

      // Listen for sound play events
      window.addEventListener("play-sound", this.handlePlaySound as EventListener);
    }
  }

  private preloadSounds(): void {
    // For the MVP, we'll use a simple approach with HTMLAudioElement
    // In a production game, we would use Howler.js for better control and performance

    // Define sound mappings
    const soundFiles = [
      ["attack", "/sounds/attack.mp3"],
      ["vehicle_enter", "/sounds/vehicle_enter.mp3"],
      ["vehicle_exit", "/sounds/vehicle_exit.mp3"],
      ["vehicle_drive", "/sounds/vehicle_drive.mp3"],
      ["destruction", "/sounds/destruction.mp3"],
      ["wanted", "/sounds/wanted.mp3"],
    ];

    // Preload all sounds
    for (const [id, path] of soundFiles) {
      // In a real implementation, we would check if the file exists
      // For now, we'll just create placeholder Audio objects
      console.log(`Would preload sound: ${id} from ${path}`);

      // Create a placeholder audio element
      const audio = new Audio();
      audio.volume = this.sfxVolume;
      this.sounds.set(id, audio);

      // In a real implementation:
      audio.src = path;
      audio.load();
    }

    // Setup background music
    this.music = new Audio();
    this.music.loop = true;
    this.music.volume = this.musicVolume;
    this.music.addEventListener("ended", () => {
      if (this.music) {
        this.music.play();
      }
    });

    // In a real implementation:
    // this.music.src = "/sounds/background_music.mp3";
    // this.music.load();
  }

  public playSound(id: string, options: { loop?: boolean; volume?: number } = {}): void {
    if (this.isMuted) return;

    const sound = this.sounds.get(id);
    if (sound) {
      // Clone the sound to allow overlapping playback
      const soundInstance = sound.cloneNode() as HTMLAudioElement;

      // Apply options
      if (options.volume !== undefined) {
        soundInstance.volume = options.volume * this.sfxVolume;
      }

      if (options.loop) {
        soundInstance.loop = true;
      }

      soundInstance.play().catch((e) => {
        console.warn(`Failed to play sound ${id}:`, e);
      });

      // Log the sound play for debug
      console.log(`Playing sound: ${id}`);
    } else {
      console.warn(`Sound not found: ${id}`);
    }
  }

  public stopSound(id: string): void {
    const sound = this.sounds.get(id);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  public playMusic(): void {
    if (this.isMuted || !this.music) return;

    this.music.play().catch((e) => {
      console.warn("Failed to play background music:", e);
    });
  }

  public pauseMusic(): void {
    if (this.music) {
      this.music.pause();
    }
  }

  public setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.music) {
      this.music.volume = this.musicVolume;
    }
  }

  public setSfxVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));

    // Update all sound volumes
    for (const sound of this.sounds.values()) {
      sound.volume = this.sfxVolume;
    }
  }

  public toggleMute(): void {
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      // Mute all audio
      if (this.music) {
        this.music.pause();
      }

      for (const sound of this.sounds.values()) {
        sound.pause();
      }

      console.log("Audio muted");
    } else {
      // Unmute and resume music
      this.playMusic();
      console.log("Audio unmuted");
    }
  }

  public isMutedState(): boolean {
    return this.isMuted;
  }

  public dispose(): void {
    // Clean up event listeners
    if (typeof window !== "undefined") {
      window.removeEventListener("keydown", this.handleKeyDown);
      window.removeEventListener("play-sound", this.handlePlaySound as EventListener);
    }

    // Stop all sounds
    if (this.music) {
      this.music.pause();
      this.music = null;
    }

    for (const sound of this.sounds.values()) {
      sound.pause();
    }

    this.sounds.clear();
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "m" || event.key === "M") {
      this.toggleMute();
    }
  };

  private handlePlaySound = (event: CustomEvent): void => {
    const { id, position, options } = event.detail;
    this.playSound(id, options);
  };
}
