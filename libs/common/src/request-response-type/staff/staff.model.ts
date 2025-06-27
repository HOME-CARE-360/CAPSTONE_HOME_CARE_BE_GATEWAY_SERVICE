import { z } from "zod";
import { updateUserSchema } from "../customer/customer.model";

export const vietnamPhoneRegex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/;

export const zodDate = () =>
    z.preprocess(
        (arg) => {
            if (typeof arg === "string" || arg instanceof Date) {
                const date = new Date(arg);
                return isNaN(date.getTime()) ? undefined : date;
            }
            return undefined;
        },
        z.date({
            required_error: "REQUIRED_DATE",
            invalid_type_error: "INVALID_DATE",
        })
    );

export const updateStaffSchema = z.object({
    providerId: z.number().optional(),
    isActive: z.boolean().optional(),
    updatedAt: zodDate().optional(),
});


export const updateUserAndStaffProfileSchema = z.object({
    user: updateUserSchema.optional(),
    staff: updateStaffSchema.optional(),
});

export type UpdateUserAndStaffProfileType = z.infer<typeof updateUserAndStaffProfileSchema>;

export const getBookingBelongToStaffQuerySchema = z.object({
    status: z.string().optional(),
    page: z.number().int().min(1).optional().default(1),
    limit: z.number().int().min(1).optional().default(10),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
    keyword: z.string().optional(),
});

export type GetBookingBelongToStaffQueryType = z.infer<typeof getBookingBelongToStaffQuerySchema>;
