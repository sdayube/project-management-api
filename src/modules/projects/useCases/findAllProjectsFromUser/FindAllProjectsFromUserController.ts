import { Request, Response } from 'express';
import { FindAllProjectsFromUserUseCase } from './FindAllProjectsFromUserUseCase';

export class FindAllProjectsFromUserController {
  async handle(request: Request, response: Response) {
    const username = request.headers.username as string;

    const findAllProjectsFromUserUseCase = new FindAllProjectsFromUserUseCase();

    const result = await findAllProjectsFromUserUseCase.execute({ username });

    return response.status(200).json(result);
  }
}
