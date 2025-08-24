import { z } from 'zod';
import { updateUserSchema } from '../../customer/customer.model';
import {
  CompanyTypeEnum,
  VerificationStatusEnum,
} from 'libs/common/src/constants/common.constants';
import { BookingReportSchema } from 'libs/common/src/models/shared-report.model';

export const zodDate = () =>
  z.preprocess(
    (arg) => {
      if (typeof arg === 'string' || arg instanceof Date) {
        const date = new Date(arg);
        return isNaN(date.getTime()) ? undefined : date;
      }
      return undefined;
    },
    z.date({
      required_error: 'REQUIRED_DATE',
      invalid_type_error: 'INVALID_DATE',
    }),
  );
export const CreateBookingReportBodySchema = BookingReportSchema.pick({
  description: true,
  imageUrls: true,
  note: true,
  reporterType: true,
  reason: true,
  reportedCustomerId: true,
  reportedProviderId: true,
  bookingId: true,

})
export const UpdateBookingReportBodySchema = BookingReportSchema.pick({
  id: true,
  description: true,
  imageUrls: true,
  note: true,
  reporterType: true,
  reason: true,

})
export const GetBookingReportBodySchema = BookingReportSchema.pick({
  id: true,
})
export const updateServiceProviderSchema = z.object({
  description: z.string().nullable().optional(),
  address: z.string().max(255, 'MAX_LENGTH').optional(),
  companyType: CompanyTypeEnum.optional(),
  industry: z.string().nullable().optional(),
  licenseNo: z.string().nullable().optional(),
  logo: z.string().url().nullable().optional(),
  taxId: z.string().optional(),
  verificationStatus: VerificationStatusEnum.optional(),
  verifiedAt: zodDate().nullable().optional(),
  verifiedById: z.number().nullable().optional(),
});
export const updateUserAndServiceProviderProfileSchema = z.object({
  user: updateUserSchema.optional(),
  serviceProvider: updateServiceProviderSchema.optional(),
});

export type UpdateServiceProviderDto = z.infer<
  typeof updateServiceProviderSchema
>;
export type UpdateUserAndServiceProviderProfileDto = z.infer<
  typeof updateUserAndServiceProviderProfileSchema
>;
