import { z } from "zod";
import { OrderBy, SortByWithDraw } from "../../constants/others.constant";

export const GetListWidthDrawQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    providerName: z.string().optional(),
    status: z.enum([
        "APPROVED", "CANCELLED", "COMPLETED", "PENDING", "REJECTED"
    ]).array(),

    orderBy: z.enum([OrderBy.Asc, OrderBy.Desc]).default(OrderBy.Desc),
    sortBy: z.enum([SortByWithDraw.CreatedAt, SortByWithDraw.Amount, SortByWithDraw.ProcessedAt]).default(SortByWithDraw.CreatedAt),
})
export type GetListWidthDrawQueryType = z.infer<typeof GetListWidthDrawQuerySchema>