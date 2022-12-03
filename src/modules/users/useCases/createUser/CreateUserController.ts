import { Request, Response } from 'express';
import { CreateUserUseCase } from './CreateUserUseCase';

export class CreateUserController {
  async handle(request: Request, response: Response) {
    const { name, username, password } = request.body;

    const createUserUseCase = new CreateUserUseCase();

    const result = await createUserUseCase.execute({
      name,
      username,
      password,
    });

    return response.status(201).json(result);
  }
}
