import { createZodDto } from 'nestjs-zod';
import { CreateProposedServiceSchema } from './proposed.model';

export class CreateProposedServiceDTO extends createZodDto(
  CreateProposedServiceSchema,
) {}
