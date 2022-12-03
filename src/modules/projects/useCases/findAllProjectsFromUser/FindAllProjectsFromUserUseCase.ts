import { prisma } from '@database/prismaClient';

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
