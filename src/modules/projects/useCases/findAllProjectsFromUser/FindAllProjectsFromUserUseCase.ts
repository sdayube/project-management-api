import { prisma } from '../../../../database/prismaClient';
import { HttpError } from '../../../../errors/HttpError';

interface IFindAllProjectsFromUser {
  username: string;
}

export class FindAllProjectsFromUserUseCase {
  async execute({ username }: IFindAllProjectsFromUser) {
    const projects = await prisma.project.findMany({
      where: { username },
    });

    return projects;
  }
}
