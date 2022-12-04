import { FinishProjectUseCase } from './FinishProjectUseCase';
import { prisma } from '@database/prismaClient';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

describe('Finish project', () => {
  const generateProject = () => ({
    id: '123',
    title: 'Project title',
    zip_code: 123456,
    done: true,
    deadline: new Date('2022-12-31'),
    cost: 123,
    username: 'johndoe',
    created_at: new Date('2022-12-31'),
    updated_at: new Date('2022-12-31'),
  });

  beforeEach(() => {
    jest.spyOn(prisma.project, 'update').mockResolvedValue(generateProject());
  });

  it('should throw if project is not found', async () => {
    const finishProjectUseCase = new FinishProjectUseCase();

    jest.spyOn(prisma.project, 'update').mockImplementationOnce(() => {
      throw new PrismaClientKnownRequestError('', {
        code: 'P2025',
        clientVersion: '',
      });
    });

    await expect(
      finishProjectUseCase.execute({
        id: '123',
      }),
    ).rejects.toThrow('Project not found');
  });

  it('should set project to done', async () => {
    const finishProjectUseCase = new FinishProjectUseCase();

    const project = await finishProjectUseCase.execute({
      id: '123',
    });

    expect(project).toEqual(generateProject());
    expect(prisma.project.update).toHaveBeenCalledTimes(1);

    expect(prisma.project.update).toHaveBeenCalledWith({
      where: { id: '123' },
      data: { done: true },
    });
  });
});
