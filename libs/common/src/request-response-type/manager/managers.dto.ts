import { createZodDto } from 'nestjs-zod';
import {
  GetListProviderQuerySchema,
  UpdateStatusProviderBodySchema,
  UpdateStatusServiceBodySchema,
} from './manager.model';

export class UpdateStatusProviderBodyDTO extends createZodDto(
  UpdateStatusProviderBodySchema,
) {}
export class UpdateStatusServiceBodyDTO extends createZodDto(
  UpdateStatusServiceBodySchema,
) {}

export class GetListProviderQueryDTO extends createZodDto(
  GetListProviderQuerySchema,
) {}
