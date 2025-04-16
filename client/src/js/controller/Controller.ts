import { Model } from '../model/Model';
import { Data, View } from '../view/View';
import '../../scss/style.scss';

// function convertMinToSec(duration: number): string {
//   const formatTime = (time: number) => (time < 10 ? `0${time}` : time);
//   const minutes: number | string = formatTime(Math.floor(duration / 60));
//   const seconds: number | string = formatTime(
//     Math.floor(duration - +minutes * 60)
//   );
//   return `${minutes}:${seconds}`;
// }

class Controller {
  model: Model;
  view: View;
  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;
  }

  async init() {
    // await this.model.loginUser('sssashaaaaaaaa', 'sssaaasha103445');
    const data: Data = (await this.model.loadingAudio()) as Data;
    return data;
    // console.log(JSON.parse(localStorage.getItem('Token') as string));
  }

  async playing() {
    const data: Data = await this.init();

    this.view.renderAudioTable(data);

    this.view.init();
    // this.view.handlePlayingAudio();
    this.view.handleProgressBar();
    this.view.handleVolumeRange();
    this.view.selectAudio(data);
  }
}

const app = new Controller(new Model(), new View());
// app.playing();

// console.log(app.model.convertMinToSec(50000));
// const range = document.querySelector(
//   '.music-player__volume-input'
// ) as HTMLInputElement;
// range.addEventListener('input', () => {
//   const value = ((+range.value - +range.min) / (+range.max - +range.min)) * 100;
//   console.log(value);
//   range.style.background =
//     'linear-gradient(to right, #fc6d3e ' + value + '%, #e8e8e8 ' + value + '%)';
// });
