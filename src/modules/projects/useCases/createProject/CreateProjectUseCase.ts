import { prisma } from '../../../../database/prismaClient';
import { HttpError } from '../../../../errors/HttpError';

interface ICreateProject {
  title: string;
  zip_code: number;
  deadline: Date;
  cost: number;
  username: string | string[] | undefined;
  userId: string;
}

export class CreateProjectUseCase {
  async execute({
    title,
    zip_code,
    deadline,
    cost,
    username,
    userId,
  }: ICreateProject) {
    if (typeof username !== 'string' || username === '') {
      throw new HttpError(
        'A valid username must be passed as request header',
        400,
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new HttpError('User not found!', 404);
    }

    if (user.id !== userId) {
      throw new HttpError('User not authorized!', 401);
    }

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
