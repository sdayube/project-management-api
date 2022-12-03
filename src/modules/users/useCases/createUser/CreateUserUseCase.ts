import { prisma } from '../../../../database/prismaClient';
import { hash } from 'bcrypt';

interface ICreateUser {
  name: string;
  username: string;
  password: string;
}

export class CreateUserUseCase {
  async execute({ name, username, password }: ICreateUser) {
    const userAlreadyExists = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });

    const passwordHash = await hash(password, 10);

    if (userAlreadyExists) {
      throw new Error('User already exists!');
    }

    const client = await prisma.user.create({
      data: {
        name,
        username,
        password: passwordHash,
      },
    });

    return client;
  }
}
