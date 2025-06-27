import type { Audio, Data } from '../view/View';

export class PlayerService {
  private audio: HTMLAudioElement;
  private isShuffleMode: boolean = false;
  private volume: number = 0.5;
  private audioCache: Map<number, HTMLAudioElement> = new Map();
  private currentTrackId = 0;
  private currentTrack: Audio;
  private isPlaying: boolean = false;
  private _tracks: Data;
  private listeners: ((isPlaying: boolean) => void)[] = [];
  private isLooping: boolean = true;
  private onTrackEndCallback?: () => void;
  private shuffledIndices: number[] = [];
  private currentShuffleIndex: number = 0;

  constructor() {
    this.audio = new Audio();
    this._tracks = [];
    this.currentTrack = {
      id: 0,
      title: 'Skyline Sounds',
      artist: 'Eternal Sunset',
      duration: 9.36,
      size_mb: 8.57,
    };
    this.notifyState();
  }

  // функция предзагрузки аудио: для теста загружаются только первые семь треков
  async preload(tracks: Data) {
    for (const audio of tracks) {
      if (audio.id > 7) return;
      const audioEl = new Audio(`/audio/${audio.id}.mp3`);
      audioEl.preload = 'auto';

      try {
        await new Promise((resolve, reject) => {
          audioEl.addEventListener('canplaythrough', resolve);
          audioEl.addEventListener('error', reject);
        });
        this.audioCache.set(audio.id, audioEl);
        console.log('done');
      } catch (error) {
        console.error(`Failed to preload audio ${audio.id}`, error);
      }
    }
  }

  // подписка на состояние isPlaying
  onStateChange(callback: (isPlaying: boolean) => void) {
    this.listeners.push(callback);
  }
  // уведомление об изменении состояния isPlaying
  private notifyState() {
    this.listeners.forEach((cb) => cb(this.isPlaying));
  }

  // получение предзагруженных аудио из коллекции Map
  getCachedAudio(id: number) {
    const cachedAudio = this.audioCache.get(id);
    return cachedAudio;
  }

  // функции для кнопок управления плейером
  play(id: number): HTMLAudioElement | undefined {
    const cachedAudio = this.getCachedAudio(id);
    if (!cachedAudio) {
      console.error('Audio not preloaded:', id);
      return;
    }
    // this.audio.currentTime = 0;
    this.audio.src = cachedAudio.src;
    this.isPlaying = true;
    this.audio.play();
    this.notifyState();
    return this.audio;
  }

  pause() {
    this.isPlaying = false;
    this.audio.pause();
    this.notifyState();
  }

  next(): void {
    if (!this._tracks.length) return;

    if (this.isShuffleMode) {
      this.currentShuffleIndex =
        (this.currentShuffleIndex + 1) % this.shuffledIndices.length;
      this.currentTrackId = this.shuffledIndices[this.currentShuffleIndex];
    } else {
      this.currentTrackId = Math.min(
        this.currentTrackId + 1,
        this._tracks.length - 1
      );
    }

    this.setTrack(this.currentTrackId);
    this.play(this.currentTrackId);
  }

  prev(): void {
    if (!this._tracks.length) return;

    if (this.isShuffleMode) {
      this.currentShuffleIndex =
        (this.currentShuffleIndex - 1 + this.shuffledIndices.length) %
        this.shuffledIndices.length;
      this.currentTrackId = this.shuffledIndices[this.currentShuffleIndex];
    } else {
      this.currentTrackId = Math.max(this.currentTrackId - 1, 0);
    }

    this.setTrack(this.currentTrackId);
    this.play(this.currentTrackId);
  }

  // функция переключения режима микса треков
  toggleShuffle(): void {
    this.isShuffleMode = !this.isShuffleMode;
    if (this.isShuffleMode) {
      this.generateShuffledIndices();
    }
  }

  // фунцкия для перемешивания аудио в массиве для микса треков
  private generateShuffledIndices(): void {
    this.shuffledIndices = Array.from(
      { length: this._tracks.length },
      (_, i) => i
    );
    for (let i = this.shuffledIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.shuffledIndices[i], this.shuffledIndices[j]] = [
        this.shuffledIndices[j],
        this.shuffledIndices[i],
      ];
    }
    this.currentShuffleIndex = 0;
  }

  // функция установки текущего времени трека для ручной перемотки трека
  setCurrentTime(time: number) {
    this.audio.currentTime = time;
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.audio.volume = volume;
  }

  set tracks(audios: Data) {
    this._tracks = audios;
  }

  get tracks() {
    return this._tracks;
  }

  setTrack(id: number): void {
    const track = this._tracks.find((t) => t.id === id);
    if (track) {
      this.currentTrackId = id;
      this.currentTrack = track;
    }
  }

  getCurrentTrack() {
    return this.currentTrack;
  }

  // фунцкия для запуска в контроллере фунцкии по изменению информации о треке после того, как текущий трек сам закончится и заиграет следующий
  setOnTrackEndCallback(callback: () => void) {
    this.onTrackEndCallback = callback;
  }

  // функция для слушателя события нажатия кнопки  микса плейлиста или его зацикленности
  handleTrackEnd = () => {
    if (!this.isLooping && !this.isShuffleMode) return;
    this.next();
    if (this.onTrackEndCallback) {
      this.onTrackEndCallback();
    }
  };
}
