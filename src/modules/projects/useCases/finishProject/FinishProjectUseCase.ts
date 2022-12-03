import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { prisma } from '../../../../database/prismaClient';
import { HttpError } from '../../../../errors/HttpError';

interface IFinishProject {
  id: string;
}

export class FinishProjectUseCase {
  async execute({ id }: IFinishProject) {
    try {
      const project = await prisma.project.update({
        where: { id },
        data: { done: true },
      });

      return project;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new HttpError('Project not found!', 404);
      }

      throw new HttpError(
        `Internal server error!: ${(error as Error).message}`,
        500,
      );
    }
  }
}
