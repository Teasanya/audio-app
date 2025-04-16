// @ts-ignore
import JustValidate from 'just-validate';
import validation from '../utils/validation';
import getFormData from '../utils/getFormdata';

export class AuthView {
  loginFormEl: HTMLFormElement;
  registerFormEl: HTMLFormElement;
  nameEl: HTMLInputElement;
  passwordEl: HTMLInputElement;
  submitBtn: HTMLButtonElement;
  modalEl: HTMLDivElement;
  modalLink: HTMLAnchorElement;
  registerLink: HTMLAnchorElement;
  constructor() {
    this.modalEl = document.querySelector(
      '.modal.modal--active'
    ) as HTMLDivElement;
    this.loginFormEl = document.querySelector(
      '.modal-form--login'
    ) as HTMLFormElement;
    this.registerFormEl = document.querySelector(
      '.modal-form--register'
    ) as HTMLFormElement;
    this.nameEl = document.querySelector('#username') as HTMLInputElement;
    this.passwordEl = document.querySelector('#password') as HTMLInputElement;
    this.submitBtn = document.querySelector(
      '.modal-form__btn'
    ) as HTMLButtonElement;
    this.modalLink = document.querySelector(
      '.modal__login-link'
    ) as HTMLAnchorElement;
    this.registerLink = document.querySelector(
      '.modal__register-link'
    ) as HTMLAnchorElement;
  }

  async handleAuthSubmit() {}

  switchFormMode() {
    this.registerLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.modalEl.classList.remove('modal--login');
      this.modalEl.classList.add('modal--register');
    });
    this.modalLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.modalEl.classList.remove('modal--register');
      this.modalEl.classList.add('modal--login');
    });
  }

  bindLogin(handler: (username: string, password: string) => void) {
    this.loginFormEl.addEventListener('submit', (e) => {
      getFormData(e, handler);
    });
  }

  bindRegister(handler: (username: string, password: string) => void) {
    this.registerFormEl.addEventListener('submit', async (e) => {
      getFormData(e, handler);
    });
  }

  loginMode() {
    return this.modalEl.classList.contains('modal--login');
  }
}
