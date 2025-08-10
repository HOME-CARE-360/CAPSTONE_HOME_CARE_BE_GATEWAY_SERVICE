import { createZodDto } from 'nestjs-zod';
import {
  CreateProposedServiceSchema,
  EditProposedServiceSchema,
} from './proposed.model';

export class CreateProposedServiceDTO extends createZodDto(
  CreateProposedServiceSchema,
) {}
export class EditProposedServiceDTO extends createZodDto(
  EditProposedServiceSchema,
) {}
