import { DeleteProjectUseCase } from './DeleteProjectUseCase';
import { prisma } from '@database/prismaClient';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

describe('Delete project', () => {
  beforeEach(() => {
    jest.spyOn(prisma.project, 'delete').mockResolvedValue({} as any);
  });

  it('should throw if project is not found', async () => {
    const deleteProjectUseCase = new DeleteProjectUseCase();

    jest.spyOn(prisma.project, 'delete').mockImplementationOnce(() => {
      throw new PrismaClientKnownRequestError('', {
        code: 'P2025',
        clientVersion: '',
      });
    });

    await expect(
      deleteProjectUseCase.execute({
        id: '123',
      }),
    ).rejects.toThrow('Project not found');
  });

  it('should remove project', async () => {
    const deleteProjectUseCase = new DeleteProjectUseCase();

    await deleteProjectUseCase.execute({
      id: '123',
    });

    expect(prisma.project.delete).toHaveBeenCalledTimes(1);
    expect(prisma.project.delete).toHaveBeenCalledWith({
      where: { id: '123' },
    });
  });
});
