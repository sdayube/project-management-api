import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import axios from 'axios';
import { prisma } from '../../../../database/prismaClient';
import { HttpError } from '../../../../errors/HttpError';

interface IUpdateProject {
  id: string;
  title: string;
  zip_code: number;
  cost: number;
  deadline: string;
}

export class UpdateProjectUseCase {
  async execute({ id, title, zip_code, cost, deadline }: IUpdateProject) {
    try {
      const project = await prisma.project.update({
        where: { id },
        data: {
          title,
          zip_code,
          cost,
          deadline: new Date(deadline),
        },
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
