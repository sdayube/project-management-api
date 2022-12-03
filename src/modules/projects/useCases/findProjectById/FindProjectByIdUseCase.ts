import axios from 'axios';
import { prisma } from '../../../../database/prismaClient';
import { HttpError } from '../../../../errors/HttpError';

interface IFindProjectById {
  id: string;
}

export class FindProjectByIdUseCase {
  async execute({ id }: IFindProjectById) {
    const projects = await prisma.project.findUnique({
      where: { id },
    });

    if (!projects) {
      throw new HttpError('Project not found!', 404);
    }

    const zipCode = projects.zip_code;

    const city = await axios
      .get(`https://viacep.com.br/ws/${zipCode}/json/`)
      .then((response) => {
        return response.data.localidade;
      });

    const { zip_code, ...projectsWithoutZip } = projects;

    return { ...projectsWithoutZip, city };
  }
}
