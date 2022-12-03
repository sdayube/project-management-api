import { Request, Response } from 'express';
import { DeleteProjectUseCase } from './DeleteProjectUseCase';

export class DeleteProjectController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;

    const deleteProjectUseCase = new DeleteProjectUseCase();

    const result = await deleteProjectUseCase.execute({ id });

    return response.status(200).json(result);
  }
}
