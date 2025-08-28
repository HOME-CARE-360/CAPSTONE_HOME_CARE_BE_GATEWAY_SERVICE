import { z } from 'zod';
import {
  OrderBy,
  SortByStaff,
  SortByWithDraw,
} from '../../constants/others.constant';
import { ReportStatus } from '@prisma/client';

export const UpdateProviderReportSchema = z.object({
  id: z.number().int(),
  status: z
    .enum([
      ReportStatus.PENDING,
      ReportStatus.REJECTED,
      ReportStatus.RESOLVED,
      ReportStatus.UNDER_REVIEW,
    ])
    .optional(),
  reviewedById: z.number().int().optional(),
  note: z.string().max(1000).optional(),
});
export const GetListReportQuerySchema = z.object({
  status: z
    .enum([
      ReportStatus.PENDING,
      ReportStatus.REJECTED,
      ReportStatus.RESOLVED,
      ReportStatus.UNDER_REVIEW,
    ])
    .optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  orderBy: z.enum([OrderBy.Asc, OrderBy.Desc]).default(OrderBy.Desc),
  sortBy: z.enum([SortByWithDraw.CreatedAt]).default(SortByWithDraw.CreatedAt),
});
export const GetBookingReportsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  status: z.nativeEnum(ReportStatus).optional(),
  orderBy: z.enum([OrderBy.Asc, OrderBy.Desc]).default(OrderBy.Desc),
  sortBy: z.enum([SortByStaff.CreatedAt]).default(SortByStaff.CreatedAt),
});

export type GetListReportQueryType = z.infer<typeof GetListReportQuerySchema>;
export type UpdateProviderReportType = z.infer<
  typeof UpdateProviderReportSchema
>;
