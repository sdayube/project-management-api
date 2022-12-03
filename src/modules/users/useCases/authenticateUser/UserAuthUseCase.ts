import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { prisma } from '../../../../database/prismaClient';
import { HttpError } from '../../../../errors/HttpError';

interface IUserAuthentication {
  username: string;
  password: string;
}

export class UserAuthUseCase {
  async execute({ username, password }: IUserAuthentication) {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      throw new HttpError('User not found!', 404);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new HttpError('Incorrect username or password!', 401);
    }

    const token = sign({ username }, process.env.JWT_SECRET!, {
      subject: user.id,
      expiresIn: '1d',
    });

    return token;
  }
}
