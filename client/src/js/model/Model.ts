const API_URL = '';

export class Model {
  data: [];

  constructor() {
    this.data = [];
  }

  async registerUser(username: string, password: string): Promise<void> {
    return fetch('http://localhost:8000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }).then((response) => response.json());
  }

  async loadingAudio() {
    return new Promise((resolve, reject): void => {
      fetch('http://localhost:8000/api/tracks')
        .then((res) => res.json())
        .then((data) => {
          this.data = data;
          resolve(data);
        })
        .catch((err) => {
          console.error('Ошибка', err);
          reject();
        });
    });
  }

  convertMinToSec(duration: number): string {
    const formatTime = (time: number) => (time < 10 ? `0${time}` : time);
    const minutes: number | string = formatTime(Math.floor(duration / 60));
    const seconds: number | string = formatTime(
      Math.floor(duration - +minutes * 60)
    );
    return `${minutes}:${seconds}`;
  }
}
