import { prisma } from '../../../../database/prismaClient';
import { HttpError } from '../../../../errors/HttpError';

interface ICreateProject {
  title: string;
  zip_code: number;
  deadline: Date;
  cost: number;
  username: string;
}

export class CreateProjectUseCase {
  async execute({ title, zip_code, deadline, cost, username }: ICreateProject) {
    const alreadyExists = await prisma.project.findFirst({
      where: {
        title: { equals: title },
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });

    if (alreadyExists) {
      throw new HttpError(
        `User '${username}' already has a project called '${title}'`,
        400,
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        zip_code,
        deadline: new Date(deadline),
        cost,
        username,
      },
    });

    return project;
  }
}
