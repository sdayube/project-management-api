import { hash } from 'bcrypt';
import { prisma } from '../../../../database/prismaClient';
import { HttpError } from '../../../../errors/HttpError';

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
      throw new HttpError('User already exists!', 400);
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
