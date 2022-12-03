import { NextFunction, Request, Response } from 'express';

import { UserAuthUseCase } from './UserAuthUseCase';
import { prisma } from '@database/prismaClient';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Authenticate user', () => {
  beforeEach(() => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: '123',
      name: 'John Doe',
      username: 'johndoe',
      password: '123456',
    });
    jest.requireMock('bcrypt').compare = jest.fn().mockResolvedValue(true);
    jest.requireMock('jsonwebtoken').sign = jest.fn().mockReturnValue('token');
  });

  it('should throw if user is not found', async () => {
    const userAuthUseCase = new UserAuthUseCase();

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);

    await expect(
      userAuthUseCase.execute({
        username: 'username',
        password: 'password',
      }),
    ).rejects.toThrow('User not found!');
  });

  it('should throw if incorrect password', async () => {
    const userAuthUseCase = new UserAuthUseCase();

    jest.requireMock('bcrypt').compare = jest.fn().mockResolvedValue(false);

    await expect(
      userAuthUseCase.execute({
        username: 'username',
        password: 'password',
      }),
    ).rejects.toThrow('Incorrect username or password!');
  });

  it('should return a token', async () => {
    const userAuthUseCase = new UserAuthUseCase();

    const token = await userAuthUseCase.execute({
      username: 'username',
      password: 'password',
    });

    expect(token).toBe('token');
  });
});
