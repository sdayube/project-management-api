import { FindAllProjectsFromUserUseCase } from './FindAllProjectsFromUserUseCase';
import { prisma } from '@database/prismaClient';

describe('Find all projects from user', () => {
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
    jest
      .spyOn(prisma.project, 'findMany')
      .mockResolvedValue(Array(3).fill(generateProject()));
  });

  it('should find projects', async () => {
    const findAllProjectsFromUserUseCase = new FindAllProjectsFromUserUseCase();

    const projects = await findAllProjectsFromUserUseCase.execute({
      username: 'johndoe',
    });

    expect(projects).toHaveLength(3);
    expect(prisma.project.findMany).toHaveBeenCalledTimes(1);
  });
});
