import { Router } from 'express';
import { checkAuth } from './middlewares/checkAuth';
import { CreateProjectController } from './modules/projects/useCases/createProject/CreateProjectController';
import { UserAuthController } from './modules/users/useCases/authenticateUser/UserAuthController';
import { CreateUserController } from './modules/users/useCases/createUser/CreateUserController';
import { FindAllProjectsFromUserController } from './modules/projects/useCases/findAllProjectsFromUser/FindAllProjectsFromUserController';
import { FindProjectByIdController } from './modules/projects/useCases/findProjectById/FindProjectByIdController';

const router = Router();

const userController = new CreateUserController();
const userAuthController = new UserAuthController();
const createProjectController = new CreateProjectController();
const findAllProjectsFromUserController =
  new FindAllProjectsFromUserController();
const findProjectByIdController = new FindProjectByIdController();

router.post('/users', userController.handle);
router.post('/auth', userAuthController.handle);
router.post('/projects', checkAuth, createProjectController.handle);
router.get('/projects', checkAuth, findAllProjectsFromUserController.handle);
router.get('/project', checkAuth, findProjectByIdController.handle);

export { router };
