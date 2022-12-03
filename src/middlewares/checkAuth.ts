import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { prisma } from '../database/prismaClient';
import { HttpError } from '../errors/HttpError';

export async function checkAuth(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;
  const username = request.headers.username as string;

  if (typeof username !== 'string' || username === '') {
    throw new HttpError(
      'A valid username must be passed as request header',
      400,
    );
  }

  if (!authHeader) {
    throw new HttpError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub } = verify(token, process.env.JWT_SECRET!);

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new HttpError('User not found!', 404);
    }

    if (user.id !== (sub as string)) {
      throw new HttpError('User not authorized!', 401);
    }

    return next();
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError('Invalid JWT token', 401);
  }
}
