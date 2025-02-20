import { Model } from '../model/Model';
import { View } from '../view/View';
import '../../scss/style.scss';

const model = new Model();
const view = new View();

function convertMinToSec(duration: number): string {
  const formatTime = (time: number) => (time < 10 ? `0${time}` : time);
  const minutes: number | string = formatTime(Math.floor(duration / 60));
  const seconds: number | string = formatTime(
    Math.floor(duration - +minutes * 60)
  );
  return `${minutes}:${seconds}`;
}

async function init() {
  /**
   * * Пробный запрос на регистрацию
   */
  await model.registerUser('sssashaaaaaaaa', 'sssaaasha@mail.ru');

  /**
   * * событие для кнопки play
   */
  const app = document.querySelector('#app');
  const audio = new Audio('/audio/1.mp3');
  let playing = false;
  app?.append(audio);
  const playBtn = document.querySelector('.music-player__play');
  playBtn?.addEventListener('click', (e) => {
    const duration = document.querySelector(
      '.music-player__time-end'
    ) as HTMLDivElement;
    duration.textContent = convertMinToSec(audio.duration);
    playing ? audio.pause() : audio.play();
    playing = !playing;
  });
}

init();
