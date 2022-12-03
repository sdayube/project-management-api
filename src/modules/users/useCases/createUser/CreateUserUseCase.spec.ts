import { NextFunction, Request, Response } from 'express';

import { CreateUserUseCase } from './CreateUserUseCase';
import { prisma } from '@database/prismaClient';

jest.mock('bcrypt');

describe('Create user', () => {
  beforeEach(() => {
    jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);
    jest.spyOn(prisma.user, 'create').mockResolvedValue({
      id: '123',
      name: 'John Doe',
      username: 'johndoe',
      password: '123456',
    });
    jest.requireMock('bcrypt').hash = jest.fn().mockResolvedValue('123456');
  });

  it('should throw if user already exist', async () => {
    const createUserUseCase = new CreateUserUseCase();

    jest.spyOn(prisma.user, 'findFirst').mockResolvedValueOnce({
      id: 'id',
      name: 'name',
      username: 'username',
      password: 'password',
    });

    await expect(
      createUserUseCase.execute({
        name: 'name',
        username: 'username',
        password: 'password',
      }),
    ).rejects.toThrow('User already exists!');
  });

  it('should create a new user', async () => {
    const createUserUseCase = new CreateUserUseCase();

    const user = await createUserUseCase.execute({
      name: 'name',
      username: 'username',
      password: 'password',
    });

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('username');
    expect(user).toHaveProperty('password');
  });

  it('should hash user password', async () => {
    const createUserUseCase = new CreateUserUseCase();

    const user = await createUserUseCase.execute({
      name: 'name',
      username: 'username',
      password: 'password',
    });

    expect(user.password).toBe('123456');
    expect(jest.requireMock('bcrypt').hash).toHaveBeenCalledTimes(1);
    expect(jest.requireMock('bcrypt').hash).toHaveBeenCalledWith(
      'password',
      10,
    );
  });
});
