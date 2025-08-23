import { createZodDto } from 'nestjs-zod';
import { CreateBookingReportBodySchema, UpdateBookingReportBodySchema, updateUserAndServiceProviderProfileSchema } from './provider.model';

export class UpdateUserAndServiceProviderProfileDTO extends createZodDto(
  updateUserAndServiceProviderProfileSchema,
) { }
export class CreateBookingReportBodyDTO extends createZodDto(CreateBookingReportBodySchema) { }
export class UpdateBookingReportBodyDTO extends createZodDto(UpdateBookingReportBodySchema) { }