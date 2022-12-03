import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { HttpError } from '../errors/HttpError';

export async function checkAuth(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new HttpError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub } = verify(token, process.env.JWT_SECRET!);

    request.userId = sub as string;

    return next();
  } catch (error) {
    throw new HttpError('Invalid JWT token', 401);
  }
}
