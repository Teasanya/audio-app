export class View {
  app: HTMLDivElement;
  audio: HTMLAudioElement;
  duration: HTMLDivElement;
  playBtn: HTMLButtonElement;
  progress: HTMLDivElement;
  timeline: HTMLDivElement;
  constructor() {
    this.app = this.getElement('#app') as HTMLDivElement;
    this.audio = new Audio('/audio/1.mp3') as HTMLMediaElement;
    this.duration = document.querySelector(
      '.music-player__time-end'
    ) as HTMLDivElement;
    this.playBtn = document.querySelector(
      '.music-player__play'
    ) as HTMLButtonElement;
    this.progress = document.querySelector(
      '.music-player__progress'
    ) as HTMLDivElement;
    this.timeline = document.querySelector(
      '.music-player__time-start'
    ) as HTMLDivElement;
  }
  createElement(tag: string, className: string) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);

    return element;
  }

  // Retrieve an element from the DOM
  getElement(selector: string) {
    const element = document.querySelector(selector);

    return element;
  }

  init() {
    this.app?.append(this.audio);
  }
  convertMinToSec(duration: number): string {
    const formatTime = (time: number) => (time < 10 ? `0${time}` : time);
    const minutes: number | string = formatTime(Math.floor(duration / 60));
    const seconds: number | string = formatTime(
      Math.floor(duration - +minutes * 60)
    );
    return `${minutes}:${seconds}`;
  }
  handlePlayingAudio() {
    let playing = false;
    this.playBtn.addEventListener('click', () => {
      this.duration.textContent = this.convertMinToSec(this.audio.duration);
      playing ? this.audio.pause() : this.audio.play();
      playing = !playing;
    });
  }
  handleProgressBar() {
    this.audio.addEventListener('timeupdate', (event: Event) => {
      const currentTime = (event.target as HTMLAudioElement).currentTime;
      const duration = (event.target as HTMLAudioElement).duration;
      const width = (currentTime * 100) / duration;
      this.timeline.innerHTML = this.convertMinToSec(currentTime);
      this.progress.style.width = `${width}%`;
    });
  }
}
