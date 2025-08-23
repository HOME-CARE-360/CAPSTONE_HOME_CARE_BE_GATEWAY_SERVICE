import { createZodDto } from 'nestjs-zod';
import { CreateBookingReportBodySchema, updateUserAndServiceProviderProfileSchema } from './provider.model';

export class UpdateUserAndServiceProviderProfileDTO extends createZodDto(
  updateUserAndServiceProviderProfileSchema,
) { }
export class CreateBookingReportBodyDTO extends createZodDto(CreateBookingReportBodySchema) { }