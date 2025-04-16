const API_URL = '';

export class Model {
  data: [];

  constructor() {
    this.data = [];
  }

  async registerUser(username: string, password: string): Promise<void> {
    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorResponse = await response.json().catch(() => null);
        console.log(errorResponse.message);
        throw new Error(`${response.status}, ${errorResponse.message}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('fetch error', error.message);
        throw error;
      } else {
        console.error('Неизвестная ошибка');
      }
    }
  }

  async loginUser(username: string, password: string): Promise<void> {
    return fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) =>
        localStorage.setItem(
          'Token',
          JSON.stringify('Bearer' + ' ' + data.token)
        )
      );
  }

  async loadingAudio() {
    return new Promise((resolve, reject): void => {
      const token = localStorage.getItem('Token');
      fetch('http://localhost:8000/api/tracks', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          console.error('Ошибка', err);
          reject();
        });
    });
  }
}
