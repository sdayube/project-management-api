import { Request, Response } from 'express';
import { FindProjectByIdUseCase } from './FindProjectByIdUseCase';

export class FindProjectByIdController {
  async handle(request: Request, response: Response) {
    const id = request.headers.id as string;

    const findProjectByIdUseCase = new FindProjectByIdUseCase();

    const result = await findProjectByIdUseCase.execute({ id });

    return response.status(200).json(result);
  }
}
