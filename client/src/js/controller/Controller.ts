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

  // async init() {
  //   /**
  //    * * Пробный запрос на регистрацию
  //    */
  //   // await model.registerUser('sssashaaaaaaaa', 'sssaaasha@mail.ru');
  //   /**
  //    * * событие для кнопки play
  //    */
  //   // const app = document.querySelector('#app');
  //   // const audio = new Audio('/audio/1.mp3') as HTMLMediaElement;
  //   // audio.addEventListener('timeupdate', (event: Event) => {
  //   //   // console.log((event.target as HTMLAudioElement).currentTime);
  //   //   // console.log(this.currentTime);
  //   // });
  //   // audio.addEventListener('timeupdate', function (event: Event) {
  //   //   // console.log((event.target as HTMLAudioElement).currentTime);
  //   //   const progress = document.querySelector('.music-player__progress');
  //   //   const timeline = document.querySelector(
  //   //     '.music-player__time-start'
  //   //   ) as HTMLDivElement;
  //   //   const currentTime = this.currentTime;
  //   //   const duration = this.duration;
  //   //   timeline.innerHTML = this.model.convertMinToSec(currentTime);
  //   // });
  // }

  playing() {
    this.view.init();
    this.view.handlePlayingAudio();
    this.view.handleProgressBar();
  }
}

const app = new Controller(new Model(), new View());
app.playing();

// console.log(app.model.convertMinToSec(50000));
