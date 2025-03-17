import { Model } from '../model/Model';
import { View } from '../view/View';
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
    await this.model.registerUser('sssashaaaaaaaa', 'sssaaasha103445');
  }

  playing() {
    this.init();

    this.view.init();
    this.view.handlePlayingAudio();
    this.view.handleProgressBar();
  }
}

const app = new Controller(new Model(), new View());
app.playing();

// console.log(app.model.convertMinToSec(50000));
