import { Model } from '../model/Model';
import { getErrorMessage } from '../utils/error';
import validation from '../utils/validation';
import { AuthView } from '../view/AuthView';

export class AuthController {
  model: Model;
  authView: AuthView;
  loginMode: boolean;

  constructor(model: Model, authView: AuthView) {
    this.model = model;
    this.authView = authView;
    this.loginMode = false;
  }

  async handleLogin(username: string, password: string) {
    try {
      const success = await this.model.loginUser(username, password);
      success && this.authView.removeModal();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log(errorMessage);
      this.authView.addErrorMessage(errorMessage);
    }
  }
  async handleRegister(username: string, password: string) {
    try {
      const result = await this.model.registerUser(username, password);
      this.authView.addSuccessMessage();
      return result;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      this.authView.addErrorMessage(errorMessage);
    }
  }

  async init() {
    this.authView.loginMode() && this.authView.removeModal();
    this.authView.switchFormMode();
    this.authView.bindLogin(this.handleLogin.bind(this));
    this.authView.bindRegister(this.handleRegister.bind(this));
    // this.authView.bindRegister(this.model.registerUser);
  }
}

// const registration = new RegistrationController(
//   new Model(),
//   new RegistrationView()
// );
// registration.init();
