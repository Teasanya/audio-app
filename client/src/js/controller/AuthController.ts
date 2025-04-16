import { Model } from '../model/Model';
import validation from '../utils/validation';
import { AuthView } from '../view/AuthView';

export class AuthController {
  model: Model;
  authView: AuthView;

  constructor(model: Model, authView: AuthView) {
    this.model = model;
    this.authView = authView;
  }

  async init() {
    this.authView.switchFormMode();
    this.authView.bindLogin(this.model.loginUser);
    this.authView.bindRegister(this.model.registerUser);
  }
}

// const registration = new RegistrationController(
//   new Model(),
//   new RegistrationView()
// );
// registration.init();
