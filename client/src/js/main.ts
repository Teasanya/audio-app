import '../scss/style.scss';
import { AuthController } from './controller/AuthController';
import { Model } from './model/Model';
import { AuthView } from './view/AuthView';

const authorization = new AuthController(new Model(), new AuthView());
authorization.init();
