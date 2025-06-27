import '../scss/style.scss';
import { AuthController } from './controller/AuthController';
import { Controller } from './controller/Controller.ts';
import { Model } from './model/Model';
import { AuthView } from './view/AuthView';
import { View } from './view/View';

const authorization = new AuthController(new Model(), new AuthView());
const musicController = new Controller(new Model(), new View());
authorization.init();
musicController.init();
