import { Router } from 'express';
import { UserAuthController } from './modules/users/useCases/authenticateUser/UserAuthController';
import { CreateUserController } from './modules/users/useCases/createUser/CreateUserController';

const router = Router();

const userController = new CreateUserController();
const userAuthController = new UserAuthController();

router.post('/users', userController.handle);
router.post('/auth', userAuthController.handle);

export { router };
