import { Data } from '../view/View';

const API_URL = '';

interface Resp<T> {
  code: number;
  data: T;
}

export class Model {
  data: [];

  constructor() {
    this.data = [];
  }

  async registerUser(username: string, password: string): Promise<unknown> {
    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;

        if (
          response.status === 400 ||
          errorMessage.toLowerCase().includes('уже существует')
        ) {
          throw new Error('USER_EXISTS');
        }

        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (e) {
      if (typeof e === 'object' && e !== null && 'message' in e) {
        throw new Error(`${e.message}`);
      }
      throw e;
    }
  }

  async loginUser(username: string, password: string): Promise<{} | unknown> {
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;

        if (
          response.status === 400 ||
          errorMessage.toLowerCase().includes('неверные')
        ) {
          throw new Error('INVALID_DATA');
        }

        throw new Error(errorMessage);
      }
      const data = await response.json();
      localStorage.setItem('Token', JSON.stringify(data.token));
      return data;
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'message' in error) {
        throw new Error(`${error.message}`);
      }
      throw error;
    }
  }

  async loadingAudio() {
    return new Promise((resolve, reject): void => {
      const token = localStorage.getItem('Token');
      fetch('http://localhost:8000/api/tracks', {
        method: 'GET',
        headers: {
          Authorization: `Bearer `,
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

  async getFavorites(): Promise<{ data?: Data; error?: string }> {
    const token = localStorage.getItem('Token') as string;
    try {
      const response = await fetch('http://localhost:8000/api/favorites', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      const result = await response.json();

      return { data: result };
    } catch (error) {
      if (error instanceof Error) {
        console.error('fetch error', error.message);
        return { error: error.message };
      } else {
        console.error('Неизвестная ошибка');
        return { error: 'Неизвестная ошибка' };
      }
    }
  }

  async addToFavorites(id: number) {
    const token = localStorage.getItem('Token') as string;

    try {
      const response = await fetch('http://localhost:8000/api/favorites', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackId: id }),
      });

      if (!response.ok) {
        throw new Error(`${response.status}`);
      }
      const data = await response.json();

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('fetch error', error.message);
        return error.message;
      } else {
        console.error('Неизвестная ошибка');
      }
    }
  }

  async deleteFromFavorites(id: number) {
    const token = localStorage.getItem('Token') as string;

    try {
      const response = await fetch('http://localhost:8000/api/favorites', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackId: id }),
      });

      if (!response.ok) {
        throw new Error(`${response.status}`);
      }
      const data = await response.json();

      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('fetch error', error.message);
        return error.message;
      } else {
        console.error('Неизвестная ошибка');
      }
    }
  }
}
