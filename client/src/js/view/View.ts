import convertMinToSec from '../utils/convertMinToSec';
export type Audio = {
  id: number;
  title: string;
  artist: string;
  duration: number;
  size_mb: number;
};
export type Data = Audio[];

export class View {
  app: HTMLDivElement;
  audio: HTMLAudioElement;
  duration: HTMLDivElement;
  playBtn: HTMLButtonElement;
  progress: HTMLDivElement;
  timeline: HTMLDivElement;
  playIcon: SVGAElement;
  pauseIcon: SVGAElement;
  volumeInput: HTMLInputElement;
  volume: number;
  audioTable: HTMLTableSectionElement;
  tableEl: HTMLTableElement;
  artistName: HTMLSpanElement;
  trackName: HTMLElement;
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
    this.playIcon = document.querySelector(
      '.music-player__play-icon'
    ) as SVGAElement;
    this.pauseIcon = document.querySelector(
      '.music-player__pause-icon'
    ) as SVGAElement;
    this.volumeInput = document.querySelector(
      '.music-player__volume-input'
    ) as HTMLInputElement;
    this.volume = 0.5;
    this.audioTable = document.querySelector(
      '.audio-table__body'
    ) as HTMLTableSectionElement;
    this.tableEl = document.querySelector('table') as HTMLTableElement;
    this.artistName = document.querySelector(
      '.music-player__track-title'
    ) as HTMLSpanElement;
    this.trackName = document.querySelector(
      '.music-player__track-name'
    ) as HTMLElement;
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

  handlePlayingAudio(id: number) {
    this.audio = new Audio(`/audio/${id}.mp3`) as HTMLMediaElement;
    this.app?.append(this.audio);
    let playing = false;
    this.playBtn.addEventListener('click', () => {
      this.duration.textContent = convertMinToSec(this.audio.duration);

      playing ? this.audio.pause() : this.audio.play();
      this.audio.volume = this.volume;
      playing = !playing;
      if (playing) {
        this.playIcon.style.display = 'none';
        this.pauseIcon.style.display = 'block';
      } else {
        this.playIcon.style.display = 'block';
        this.pauseIcon.style.display = 'none';
      }
    });
  }
  handleProgressBar() {
    this.audio.addEventListener('timeupdate', (event: Event) => {
      (event.target as HTMLAudioElement).volume = this.volume;
      const currentTime = (event.target as HTMLAudioElement).currentTime;
      const duration = (event.target as HTMLAudioElement).duration;
      const width = (currentTime * 100) / duration;
      this.timeline.innerHTML = convertMinToSec(currentTime);
      this.progress.style.width = `${width}%`;
    });
  }

  handleVolumeRange() {
    this.volumeInput.addEventListener('input', () => {
      this.volume = +this.volumeInput.value;
      const value =
        ((+this.volumeInput.value - +this.volumeInput.min) /
          (+this.volumeInput.max - +this.volumeInput.min)) *
        100;

      this.volumeInput.style.background =
        'linear-gradient(to right, #fc6d3e ' +
        value +
        '%, #e8e8e8 ' +
        value +
        '%)';
    });
  }

  renderAudioTable(audios: Data) {
    audios.forEach((audio) => {
      const row = document.createElement('tr') as HTMLTableRowElement;
      row.setAttribute('id', audio.id.toString());
      row.innerHTML = `
        <td>${audio.id}</td>
        <td>${audio.artist}</td>
        <td>${audio.title}</td>
        <td>${Math.floor(Math.random() * 10)} дней назад</td>
        <td>${audio.duration}</td>
        
        `;
      this.audioTable.append(row);
    });
  }

  selectAudio(audios: Data) {
    this.tableEl.addEventListener('click', (event: Event) => {
      const targetTrId = (event.target as HTMLElement)
        .closest('tr')
        ?.getAttribute('id');
      const audio = audios.find(
        (audio) => targetTrId && audio.id === +targetTrId
      );
      if (audio) {
        this.artistName.textContent = audio.artist;
        this.trackName.textContent = audio.title;
        this.handlePlayingAudio(audio?.id);
      }
    });
  }
}
