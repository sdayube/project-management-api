import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { prisma } from '../../../../database/prismaClient';
import { HttpError } from '../../../../errors/HttpError';

interface IDeleteProject {
  id: string;
}

export class DeleteProjectUseCase {
  async execute({ id }: IDeleteProject) {
    try {
      await prisma.project.delete({
        where: { id },
      });

      return { message: `Project ${id} was succesfully deleted` };
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
