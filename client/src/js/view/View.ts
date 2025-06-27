import { PlayerService } from '../player/PlayerService';
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
  nextBtn: HTMLButtonElement;
  prevBtn: HTMLButtonElement;
  likeBtn: HTMLButtonElement;
  player: PlayerService;
  timeEnd: HTMLDivElement;
  progressContainer: HTMLDivElement;
  liked: boolean = false;
  imgWrapper: HTMLDivElement;
  shuffleBtn: HTMLButtonElement;
  loopBtn: HTMLButtonElement;
  listeners: ((favoritesPage: boolean) => void)[] = [];
  navMenu: HTMLUListElement;
  favoritesPage: boolean = false;
  searchEl: HTMLInputElement;
  constructor() {
    this.duration = document.querySelector(
      '.music-player__time-end'
    ) as HTMLDivElement;
    this.playBtn = document.querySelector(
      '.music-player__play'
    ) as HTMLButtonElement;
    this.progress = document.querySelector(
      '.music-player__progress'
    ) as HTMLDivElement;
    this.progressContainer = document.querySelector(
      '.music-player__progress-bar'
    ) as HTMLDivElement;
    this.timeline = document.querySelector(
      '.music-player__time-start'
    ) as HTMLDivElement;
    this.timeEnd = document.querySelector(
      '.music-player__time-end'
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
    this.nextBtn = document.querySelector(
      '.music-player__btn-next'
    ) as HTMLButtonElement;
    this.prevBtn = document.querySelector(
      '.music-player__btn-prev'
    ) as HTMLButtonElement;
    this.likeBtn = document.querySelector(
      '.music-player__like-btn'
    ) as HTMLButtonElement;
    this.player = new PlayerService();
    this.imgWrapper = document.querySelector(
      '.music-player__img-wrapper'
    ) as HTMLDivElement;
    this.shuffleBtn = document.querySelector(
      '.music-player__shuffle'
    ) as HTMLButtonElement;

    this.loopBtn = document.querySelector(
      '.music-player__repeat'
    ) as HTMLButtonElement;
    this.navMenu = document.querySelector(
      '.navigation__menu'
    ) as HTMLUListElement;
    this.searchEl = document.querySelector(
      '.header__input-field'
    ) as HTMLInputElement;
  }

  // подписка на состояние favoritesPage
  async onStateChange(callback: (favoritesPage: boolean) => void) {
    this.listeners.push(callback);
  }
  // уведомление об изменении состояния favoritesPage
  private notifyState() {
    this.listeners.forEach((cb) => cb(this.favoritesPage));
  }

  renderAudioTable(audios: Data) {
    this.audioTable.innerHTML = '';
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

  updateTrackInfo(audio: Audio) {
    this.artistName.textContent = audio.artist;
    this.trackName.textContent = audio.title;
    this.likeBtn.dataset.id = audio.id.toString();
  }

  updatePlayButton(isPlaying: boolean) {
    if (isPlaying) {
      this.playBtn.classList.add('music-player__play--paused');
    } else {
      this.playBtn.classList.remove('music-player__play--paused');
    }
  }

  updateVolumeSlider(volume: number): void {
    this.volumeInput.style.background = `linear-gradient(to right, #fc6d3e ${
      volume * 100
    }%, #e8e8e8 ${volume * 100}%)`;
  }

  bindSearchInput(handler: (e: Event) => void): void {
    this.searchEl.addEventListener('input', handler);
  }

  animateAlbumImg(isPlaying: boolean) {
    if (isPlaying) {
      this.imgWrapper.classList.add('music-player__img-wrapper--animated');
    } else {
      this.imgWrapper.classList.remove('music-player__img-wrapper--animated');
    }
  }

  bindNextClick(handler: () => void): void {
    this.nextBtn.addEventListener('click', handler);
  }

  bindPrevClick(handler: () => void): void {
    this.prevBtn.addEventListener('click', handler);
  }

  bindPlayBtn(handler: () => void) {
    this.playBtn.addEventListener('click', () => {
      handler();
    });
  }

  bindShuffleClick(handler: () => void): void {
    this.shuffleBtn.addEventListener('click', () => {
      handler();
      if (this.loopBtn.classList.contains('btn--active'))
        this.loopBtn.classList.remove('btn--active');
      this.shuffleBtn.classList.toggle('btn--active');
    });
  }

  bindLoopingClick(handler: () => void): void {
    this.loopBtn.addEventListener('click', () => {
      handler();
      if (this.shuffleBtn.classList.contains('btn--active'))
        this.shuffleBtn.classList.remove('btn--active');
      this.loopBtn.classList.toggle('btn--active');
    });
  }

  bindVolumeChange(handler: (volume: number) => void): void {
    this.volumeInput.addEventListener('input', (e) => {
      const volume = parseFloat((e.target as HTMLInputElement).value);
      handler(volume);
    });
  }

  bindNavigationChange() {
    this.navMenu.addEventListener('click', async (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const attribute = target.closest('li')?.getAttribute('id');

      if (attribute === 'favorites-link' && !this.favoritesPage) {
        this.favoritesPage = true;
        this.notifyState();
      } else if (attribute !== 'favorites-link' && this.favoritesPage) {
        this.favoritesPage = false;
        this.notifyState();
      }
    });
  }

  selectAudio(audios: Data, playHandler: (id: number) => void) {
    this.tableEl.addEventListener('click', (e) => {
      const targetTr = (e.target as HTMLElement).closest('tr');
      if (!targetTr) return;

      const targetTrId = targetTr.getAttribute('id');
      if (!targetTrId) return;

      const audio = audios.find((audio) => audio.id === +targetTrId);
      if (audio) {
        this.updateTrackInfo(audio);
        playHandler(audio.id);
      }
    });
  }

  handleProgressBar(currentAudio: HTMLAudioElement) {
    const updateProgress = (e: Event) => {
      if (!isFinite(currentAudio.duration)) return;

      const currentTime = currentAudio.currentTime;
      const duration = currentAudio.duration;
      const progressPercent = (currentTime / duration) * 100;

      this.timeline.textContent = convertMinToSec(currentTime);
      this.timeEnd.textContent = convertMinToSec(duration);
      this.progress.style.width = `${progressPercent}%`;
    };

    currentAudio.removeEventListener('timeupdate', updateProgress);
    currentAudio.addEventListener('timeupdate', (e) => {
      updateProgress(e);
    });
  }

  setupModeListener(audio: HTMLAudioElement, handler: () => void): void {
    audio.addEventListener('ended', () => {
      handler();
    });
  }

  removeLoopListener(): void {
    // this.audio.removeEventListener('ended', this.handleTrackEnd);
  }

  handleRewind(audio: HTMLAudioElement, handler: (time: number) => void) {
    this.progressContainer.addEventListener('click', (e: MouseEvent) => {
      const width: number = +(e.target as HTMLDivElement).clientWidth;
      const clickOffset = e.offsetX;
      const duration = audio.duration;
      const audioCurrentTime = (clickOffset / width) * duration;
      handler(audioCurrentTime);
    });
  }

  SwitchToFavorite(handler: (id: number, isLiked: boolean) => void) {
    this.likeBtn.addEventListener('click', () => {
      this.likeBtn.classList.toggle('btn--liked');
      const id = this.likeBtn.dataset.id;
      if (id) {
        handler(+id, this.liked);
      }
      this.liked = !this.liked;
    });
  }

  showError(message: string) {
    let errorElement = document.getElementById('error-message');

    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = 'error-message';
      errorElement.style.color = 'red';
      errorElement.style.padding = '10px';
      errorElement.style.margin = '10px 0';
      errorElement.style.border = '1px solid red';
      this.audioTable.prepend(errorElement);
    }

    errorElement.textContent = `Ошибка: ${message}`;

    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
      errorElement?.remove();
    }, 5000);
  }
}
