import { UpdateProjectUseCase } from './UpdateProjectUseCase';
import { prisma } from '@database/prismaClient';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

describe('Update project', () => {
  const generateProject = () => ({
    id: '123',
    title: 'Project title',
    zip_code: 123456,
    done: false,
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
    const updateProjectUseCase = new UpdateProjectUseCase();

    jest.spyOn(prisma.project, 'update').mockImplementationOnce(() => {
      throw new PrismaClientKnownRequestError('', {
        code: 'P2025',
        clientVersion: '',
      });
    });

    await expect(
      updateProjectUseCase.execute({
        id: '123',
        title: 'Project title',
        zip_code: 123456,
        deadline: '2022-12-31',
        cost: 123,
      }),
    ).rejects.toThrow('Project not found');
  });

  it('should update a project', async () => {
    const updateProjectUseCase = new UpdateProjectUseCase();

    const project = await updateProjectUseCase.execute({
      id: '123',
      title: 'Project title',
      zip_code: 123456,
      deadline: '2022-12-31',
      cost: 123,
    });

    expect(project).toEqual(generateProject());
    expect(prisma.project.update).toHaveBeenCalledTimes(1);
  });
});
