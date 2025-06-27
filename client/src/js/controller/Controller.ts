import { Model } from '../model/Model';
import { Data, View } from '../view/View';
import '../../scss/style.scss';
import { PlayerService } from '../player/PlayerService';
import debounce from '../utils/debounce';

export class Controller {
  model: Model;
  view: View;
  player: PlayerService;
  favoriteMode: boolean;
  data: Data = [];

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;
    this.player = new PlayerService();
    // Подписка на событие окончания трека
    this.player.setOnTrackEndCallback(() => this.updateUI());
    this.view.onStateChange((favoritesPage) => {
      this.pageHandler(favoritesPage);
    });

    this.favoriteMode = false;
  }

  // загрузка треков с сервера
  async init() {
    this.data = (await this.model.loadingAudio()) as Data;
    await this.playing();
  }

  // подготовка к проигрыванию треков
  async playing() {
    this.view.renderAudioTable(this.data);
    this.player.tracks = this.data;
    this.player.preload(this.data);

    // Устанавливаем первый трек только если нет текущего
    if (!this.player.getCurrentTrack()) {
      this.player.setTrack(1);
      const track = this.player.getCurrentTrack();
      this.view.updateTrackInfo(track);
    }

    this.player.onStateChange((isPlaying) => {
      this.view.updatePlayButton(isPlaying);
      this.view.animateAlbumImg(isPlaying);
    });

    this.view.selectAudio(this.data, (id: number) => {
      this.handleTrackSelect(id);
    });

    this.bindEvents();
  }

  async pageHandler(favoritesPage: boolean) {
    this.favoriteMode = favoritesPage;

    try {
      let result;
      if (favoritesPage) {
        result = await this.model.getFavorites();
        if (result.error) {
          this.view.showError(result.error);
          this.data = [];
        } else {
          this.data = result.data || [];
        }
      } else {
        this.data = ((await this.model.loadingAudio()) as Data) || [];
      }

      if (!Array.isArray(this.data)) {
        console.error('Data is not an array:', this.data);
        this.data = [];
      }

      this.view.renderAudioTable(this.data);
      this.player.tracks = this.data;
      this.player.preload(this.data);

      if (this.player.getCurrentTrack()) {
        this.updateUI();
      }

      this.view.selectAudio(this.data, (id: number) => {
        this.handleTrackSelect(id);
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      this.view.showError(errorMessage);
      this.data = [];
      this.view.renderAudioTable(this.data);
    }
  }

  private handleTrackSelect(id: number) {
    this.playTrack(id);
  }
  playBtnHandler() {
    this.view.bindPlayBtn(() => {
      if (this.player.getIsPlaying()) {
        this.player.pause();
      } else {
        const track = this.player.getCurrentTrack();
        this.playTrack(track.id);
      }
    });
  }

  private onChange(e: Event) {
    console.log(this, 'onchange');
    const value = (e.target as HTMLInputElement).value;
    const tracks = this.player.tracks;
    console.log(value);
  }

  // private getDebouncedOnChange() {
  //   console.log(this);
  //   return debounce(this.onChange.bind(this), 500);
  // }

  private debouncedOnChange = debounce(this.onChange.bind(this), 500);

  private bindEvents() {
    this.view.bindSearchInput(this.debouncedOnChange);
    this.playBtnHandler();
    this.view.bindNextClick(() => {
      this.player.next();
      this.updateUI();
    });

    this.view.bindPrevClick(() => {
      this.player.prev();
      this.updateUI();
    });

    this.view.bindVolumeChange((volume) => {
      this.player.setVolume(volume);
      this.view.updateVolumeSlider(volume);
    });

    this.view.SwitchToFavorite((id: number, isLiked: boolean) => {
      if (isLiked) {
        this.model.deleteFromFavorites(id);
      } else {
        this.model.addToFavorites(id);
      }
    });

    this.view.bindShuffleClick(() => this.toggleShuffle());
    this.view.bindLoopingClick(() => this.toggleShuffle());
    this.view.bindNavigationChange();
  }

  private updateUI(): void {
    const currentTrack = this.player.getCurrentTrack();
    if (currentTrack) {
      this.view.updateTrackInfo(currentTrack);
    }
  }

  toggleShuffle(): void {
    this.player.toggleShuffle();
  }

  private playTrack(id: number) {
    this.player.pause();
    this.player.setTrack(id);
    const audioElement = this.player.play(id);
    const currentTrack = this.player.getCurrentTrack();
    this.view.updateTrackInfo(currentTrack);
    this.view.updatePlayButton(true);

    if (audioElement) {
      this.view.handleProgressBar(audioElement);
      this.view.handleRewind(
        audioElement,
        this.player.setCurrentTime.bind(this.player)
      );
      this.view.setupModeListener(
        audioElement,
        this.player.handleTrackEnd.bind(this.player)
      );
    }
  }

  getFavoritesList() {
    return this.model.getFavorites();
  }
}
