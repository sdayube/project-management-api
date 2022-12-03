import { Router } from 'express';
import { CreateProjectController } from './modules/projects/useCases/createProject/CreateProjectController';
import { UserAuthController } from './modules/users/useCases/authenticateUser/UserAuthController';
import { CreateUserController } from './modules/users/useCases/createUser/CreateUserController';

const router = Router();

const userController = new CreateUserController();
const userAuthController = new UserAuthController();
const createProjectController = new CreateProjectController();

router.post('/users', userController.handle);
router.post('/auth', userAuthController.handle);
router.post('/projects', createProjectController.handle);

export { router };
