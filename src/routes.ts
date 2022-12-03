import { Router } from 'express';
import { checkAuth } from '@middlewares/checkAuth';
import {
  CreateUserController,
  UserAuthController,
} from '@modules/users/useCases/';
import {
  CreateProjectController,
  FindAllProjectsFromUserController,
  FindProjectByIdController,
  UpdateProjectController,
  FinishProjectController,
  DeleteProjectController,
} from '@modules/projects/useCases/';

const router = Router();

// Users
const userController = new CreateUserController();
router.post('/users', userController.handle);

const userAuthController = new UserAuthController();
router.post('/auth', userAuthController.handle);

// Projects
const createProjectController = new CreateProjectController();
router.post('/project', checkAuth, createProjectController.handle);

const findAllProjectsFromUserController =
  new FindAllProjectsFromUserController();
router.get('/projects', checkAuth, findAllProjectsFromUserController.handle);

const findProjectByIdController = new FindProjectByIdController();
router.get('/project', checkAuth, findProjectByIdController.handle);

const updateProjectController = new UpdateProjectController();
router.put('/projects/:id', checkAuth, updateProjectController.handle);

const finishProjectController = new FinishProjectController();
router.patch('/projects/:id/done', checkAuth, finishProjectController.handle);

const deleteProjectController = new DeleteProjectController();
router.delete('/projects/:id', checkAuth, deleteProjectController.handle);

export { router };
