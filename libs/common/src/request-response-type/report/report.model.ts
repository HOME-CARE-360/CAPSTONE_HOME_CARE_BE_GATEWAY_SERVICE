import { z } from 'zod';
import { OrderBy, SortByWithDraw } from '../../constants/others.constant';
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
  reviewedAt: z.date().optional(),
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
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  orderBy: z.enum([OrderBy.Asc, OrderBy.Desc]).default(OrderBy.Desc),
  sortBy: z.enum([SortByWithDraw.CreatedAt]).default(SortByWithDraw.CreatedAt),
});

export type GetListReportQueryType = z.infer<typeof GetListReportQuerySchema>;
export type UpdateProviderReportType = z.infer<
  typeof UpdateProviderReportSchema
>;
