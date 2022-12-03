import { prisma } from '../../../../database/prismaClient';
import { HttpError } from '../../../../errors/HttpError';

interface IFindAllProjectsFromUser {
  username: string | string[] | undefined;
  userId: string;
}

export class FindAllProjectsFromUserUseCase {
  async execute({ username, userId }: IFindAllProjectsFromUser) {
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

    const projects = await prisma.project.findMany({
      where: { username },
    });

    return projects;
  }
}
