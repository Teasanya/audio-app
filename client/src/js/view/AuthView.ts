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
  errorTitle: HTMLDivElement;
  formEl: HTMLFormElement;
  constructor() {
    this.modalEl = document.querySelector(
      '.modal.modal--active'
    ) as HTMLDivElement;
    this.formEl = document.querySelector('.modal-form') as HTMLFormElement;
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
    this.errorTitle = document.querySelector('.modal__error') as HTMLDivElement;
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

  cleanForm() {
    this.registerFormEl.reset();
  }

  bindLogin(handler: (username: string, password: string) => void) {
    this.loginFormEl.addEventListener('submit', (e) => {
      const { username, password } = getFormData(e);
      handler(username, password);
    });
  }

  bindRegister(handler: (username: string, password: string) => void) {
    this.registerFormEl.addEventListener('submit', async (e) => {
      const { username, password } = getFormData(e);
      handler(username, password);
    });
  }

  loginMode() {
    const token = localStorage.getItem('Token');
    if (token) {
      return true;
    }
    return false;
  }

  removeModal() {
    this.modalEl.classList.remove('modal--active');
  }

  addErrorMessage(error: string) {
    this.modalEl.classList.add('modal--error');
    switch (error) {
      case 'USER_EXISTS':
        this.errorTitle.textContent =
          'Пользователь с таким именем уже существует!';
        break;
      case 'INVALID_DATA':
        this.errorTitle.textContent = 'Вы ввели неверные данные';
        break;
      default:
        this.errorTitle.textContent = 'Произошла ошибка - попробуйте еще раз';
    }
    this.cleanForm();
    this.removeClass('modal--error');
  }

  removeClass(className: string): void {
    setTimeout(() => {
      this.modalEl.classList.remove(className);
    }, 4000);
  }

  addSuccessMessage() {
    this.modalEl.classList.add('modal--success');
    this.removeClass('modal--success');
  }
}
