import { z } from "zod";


export const GetCustomerInformationParamsSchema = z
    .object({
        userId: z.coerce.number().int().positive(),
    })
    .strict()

export type GetCustomerInformationParamsType = z.infer<typeof GetCustomerInformationParamsSchema>