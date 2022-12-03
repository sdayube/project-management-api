import { Request, Response } from 'express';
import { UpdateProjectUseCase } from './UpdateProjectUseCase';

export class UpdateProjectController {
  async handle(request: Request, response: Response) {
    const { id } = request.params;
    const { title, zip_code, cost, deadline } = request.body;

    const updateProjectUseCase = new UpdateProjectUseCase();

    const result = await updateProjectUseCase.execute({
      id,
      title,
      zip_code,
      cost,
      deadline,
    });

    return response.status(200).json(result);
  }
}
