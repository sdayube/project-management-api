import { Request, Response } from 'express';
import { UserAuthUseCase } from './UserAuthUseCase';

export class UserAuthController {
  async handle(request: Request, response: Response) {
    const { username, password } = request.body;

    const userAuthUseCase = new UserAuthUseCase();

    const token = await userAuthUseCase.execute({ username, password });
    return response.json({ token });
  }
}
