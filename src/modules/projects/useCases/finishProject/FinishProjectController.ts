import { Request, Response } from 'express';
import { FinishProjectUseCase } from './FinishProjectUseCase';

export class FinishProjectController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;

    const finishProjectUseCase = new FinishProjectUseCase();

    const result = await finishProjectUseCase.execute({
      id,
    });

    return response.status(200).json(result);
  }
}
