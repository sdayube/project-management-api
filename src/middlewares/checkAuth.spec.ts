import { NextFunction, Request, Response } from 'express';
import { checkAuth } from './checkAuth';
import { prisma } from '@database/prismaClient';

jest.mock('jsonwebtoken');

describe('Authorization middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
    };
  });

  it('should throw if no username is present', async () => {
    mockRequest.headers = {
      authorization: 'Bearer token',
    };

    await expect(
      checkAuth(mockRequest as Request, mockResponse as Response, nextFunction),
    ).rejects.toThrow('A valid username must be passed as request header');
  });

  it('should throw if no username is present', async () => {
    mockRequest.headers = {
      username: 'username',
    };

    await expect(
      checkAuth(mockRequest as Request, mockResponse as Response, nextFunction),
    ).rejects.toThrow('JWT token is missing');
  });

  it("should throw if bearer token can't be verified", async () => {
    mockRequest.headers = {
      username: 'username',
      authorization: 'Bearer token',
    };

    await expect(
      checkAuth(mockRequest as Request, mockResponse as Response, nextFunction),
    ).rejects.toThrow('Invalid JWT token');
  });

  it('should throw if username is not found', async () => {
    mockRequest.headers = {
      username: 'username',
      authorization: 'Bearer bearer',
    };

    jest.requireMock('jsonwebtoken').verify = jest.fn().mockReturnValue({
      sub: 'sub',
    });

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    await expect(
      checkAuth(mockRequest as Request, mockResponse as Response, nextFunction),
    ).rejects.toThrow('User not found!');
  });

  it('should throw if user id not matches token subscription', async () => {
    mockRequest.headers = {
      username: 'username',
      authorization: 'Bearer bearer',
    };

    jest.requireMock('jsonwebtoken').verify = jest.fn().mockReturnValue({
      sub: 'sub',
    });

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'id',
      name: 'name',
      username: 'username',
      password: 'password',
    });

    await expect(
      checkAuth(mockRequest as Request, mockResponse as Response, nextFunction),
    ).rejects.toThrow('User not authorized!');
  });

  it('should call next function if everything is ok', async () => {
    mockRequest.headers = {
      username: 'username',
      authorization: 'Bearer bearer',
    };

    jest.requireMock('jsonwebtoken').verify = jest.fn().mockReturnValue({
      sub: 'id',
    });

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'id',
      name: 'name',
      username: 'username',
      password: 'password',
    });

    await checkAuth(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(nextFunction).toHaveBeenCalled();
  });
});
