import { z } from 'zod';

export const GetCustomerInformationParamsSchema = z
  .object({
    userId: z.coerce.number().int().positive(),
  })
  .strict();

export type GetCustomerInformationParamsType = z.infer<
  typeof GetCustomerInformationParamsSchema
>;

export const LinkBankAccountSchema = z.object({
  bankCode: z.string().min(2),
  accountNumber: z.string().min(6),
});

export const CustomerCompleteBookingSchema = z.object({
  bookingId: z
    .number()
    .int()
    .positive('Booking ID must be a positive integer.'),
});

export const createCustomerReportSchema = z.object({
  bookingId: z.number().int().positive(),
  customerId: z.number().int().positive(),
  reason: z.string().min(3).max(255),
  description: z.string().max(2000).optional(),
  imageUrls: z.array(z.string().url()).optional(),
});
