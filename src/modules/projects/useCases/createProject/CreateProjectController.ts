import { Request, Response } from 'express';
import { CreateProjectUseCase } from './CreateProjectUseCase';

export class CreateProjectController {
  async handle(request: Request, response: Response) {
    const { title, zip_code, deadline, cost } = request.body;
    const username = request.headers.username as string;
    const { userId } = request;

    const createProjectUseCase = new CreateProjectUseCase();

    const result = await createProjectUseCase.execute({
      title,
      zip_code,
      deadline,
      cost,
      username,
      userId,
    });

    return response.status(201).json(result);
  }
}
