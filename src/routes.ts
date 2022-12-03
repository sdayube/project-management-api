import { Router } from 'express';
import { CreateProjectController } from './modules/projects/useCases/createProject/CreateProjectController';
import { UserAuthController } from './modules/users/useCases/authenticateUser/UserAuthController';
import { CreateUserController } from './modules/users/useCases/createUser/CreateUserController';
import { checkAuth } from './middlewares/checkAuth';
import { FindAllProjectsFromUserController } from './modules/projects/useCases/findAllProjectsFromUser/FindAllProjectsFromUserController';

const router = Router();

const userController = new CreateUserController();
const userAuthController = new UserAuthController();
const createProjectController = new CreateProjectController();
const findAllProjectsFromUserController =
  new FindAllProjectsFromUserController();

router.post('/users', userController.handle);
router.post('/auth', userAuthController.handle);
router.post('/projects', checkAuth, createProjectController.handle);
router.get('/projects', checkAuth, findAllProjectsFromUserController.handle);

export { router };
