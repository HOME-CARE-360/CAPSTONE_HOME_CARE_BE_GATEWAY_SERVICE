import { z } from "zod";


export const GetCustomerInformationParamsSchema = z
    .object({
        userId: z.coerce.number().int().positive(),
    })
    .strict()

export type GetCustomerInformationParamsType = z.infer<typeof GetCustomerInformationParamsSchema>


export const LinkBankAccountSchema = z.object({
  bankCode: z.string().min(2),
  accountNumber: z.string().min(6),
});

