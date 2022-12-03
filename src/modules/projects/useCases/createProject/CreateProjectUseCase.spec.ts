import { CreateProjectUseCase } from './CreateProjectUseCase';
import { prisma } from '@database/prismaClient';

describe('Create project', () => {
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
    jest.spyOn(prisma.project, 'findFirst').mockResolvedValue(null);
    jest.spyOn(prisma.project, 'create').mockResolvedValue(generateProject());
    jest.requireMock('bcrypt').hash = jest.fn().mockResolvedValue('123456');
  });

  it('should throw if project already exists', async () => {
    const createProjectUseCase = new CreateProjectUseCase();

    jest
      .spyOn(prisma.project, 'findFirst')
      .mockResolvedValueOnce(generateProject());

    await expect(
      createProjectUseCase.execute({
        title: 'Project title',
        zip_code: 123456,
        deadline: '2022-12-31',
        cost: 123,
        username: 'johndoe',
      }),
    ).rejects.toThrow(
      "User 'johndoe' already has a project called 'Project title'",
    );

    expect(prisma.project.create).not.toHaveBeenCalled();
  });

  it('should create a new project', async () => {
    const createProjectUseCase = new CreateProjectUseCase();

    const project = await createProjectUseCase.execute({
      title: 'Project title',
      zip_code: 123456,
      deadline: '2022-12-31',
      cost: 123,
      username: 'johndoe',
    });

    expect(project).toEqual(generateProject());
    expect(prisma.project.create).toHaveBeenCalledTimes(1);
  });
});
