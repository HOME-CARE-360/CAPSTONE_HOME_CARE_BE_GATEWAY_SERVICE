import { createZodDto } from 'nestjs-zod';
import {
  CreateBookingReportBodySchema,
  GetBookingReportBodySchema,
  UpdateBookingReportBodySchema,
  updateUserAndServiceProviderProfileSchema,
} from './provider.model';
import { GetBookingReportsQuerySchema } from '../../report/report.model';

export class UpdateUserAndServiceProviderProfileDTO extends createZodDto(
  updateUserAndServiceProviderProfileSchema,
) {}
export class GetBookingReportsQueryDTO extends createZodDto(
  GetBookingReportsQuerySchema,
) {}
export class GetBookingReportQueryDTO extends createZodDto(
  GetBookingReportBodySchema,
) {}

export class CreateBookingReportBodyDTO extends createZodDto(
  CreateBookingReportBodySchema,
) {}
export class UpdateBookingReportBodyDTO extends createZodDto(
  UpdateBookingReportBodySchema,
) {}
