import { FindProjectByIdUseCase } from './FindProjectByIdUseCase';
import { prisma } from '@database/prismaClient';

jest.mock('axios');

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
      .spyOn(prisma.project, 'findUnique')
      .mockResolvedValue(generateProject());

    jest.requireMock('axios').get.mockResolvedValue({
      data: {
        localidade: 'Salvador',
      },
    });
  });

  it('should throw if project does not exist', async () => {
    const findProjectByIdUseCase = new FindProjectByIdUseCase();

    jest.spyOn(prisma.project, 'findUnique').mockResolvedValueOnce(null);

    await expect(
      findProjectByIdUseCase.execute({
        id: '123',
      }),
    ).rejects.toThrow('Project not found');

    expect(prisma.project.findUnique).toHaveBeenCalledTimes(1);
  });

  it('should fetch city from zip code', async () => {
    const findProjectByIdUseCase = new FindProjectByIdUseCase();

    const project = await findProjectByIdUseCase.execute({
      id: '123',
    });

    expect(jest.requireMock('axios').get).toHaveBeenCalledTimes(1);
    expect(jest.requireMock('axios').get).toHaveBeenCalledWith(
      'https://viacep.com.br/ws/123456/json/',
    );
  });

  it('should return found project with city', async () => {
    const findProjectByIdUseCase = new FindProjectByIdUseCase();

    const project = await findProjectByIdUseCase.execute({
      id: '123',
    });

    const { zip_code, ...projectWithoutZip } = generateProject();

    const expectedProject = {
      ...projectWithoutZip,
      city: 'Salvador',
    };

    expect(project).toEqual(expectedProject);
    expect(prisma.project.findUnique).toHaveBeenCalledTimes(1);
  });
});
