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
  reason: z.string().min(3).max(255),
  description: z.string().max(2000).optional(),
  imageUrls: z.array(z.string().url()).optional(),
});

export const getMyTxQuerySchema = z.object({
  // Use z.coerce.number() to automatically convert the 'page' string to a number.
  page: z.coerce.number().int().positive().default(1).describe('Page number, starts from 1'),
  
  // Use z.coerce.number() to handle the 'limit' string and validate it as a number.
  limit: z.coerce.number().int().positive().max(200).default(10).describe('Number of items per page, max is 200'),
  
  status: z.string().optional().describe('Filter by transaction status'),
  method: z.string().optional().describe('Filter by payment method'),
  dateFrom: z.string().datetime().optional().describe('Start date for the transaction period (ISO 8601)'),
  dateTo: z.string().datetime().optional().describe('End date for the transaction period (ISO 8601)'),
  sortBy: z.enum(['createdAt', 'updatedAt', 'amount', 'status']).default('createdAt').describe('Sort transactions by a specific field'),
  sortOrder: z.enum(['asc', 'desc']).default('desc').describe('Sort order'),
  q: z.string().optional().describe('Search query for transactions'),
});