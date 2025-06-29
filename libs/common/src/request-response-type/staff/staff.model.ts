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

export const GetBookingBelongToStaffQuerySchema = z.object({
    status: z.string().optional(),
    page: z.number().int().min(1).optional().default(1),
    limit: z.number().int().min(1).optional().default(10),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
    keyword: z.string().optional(),
});
export const GetBookingDetailSchema = z.object({
    bookingId: z.coerce.number().int().positive(),

});
export const GetInspectionDetailSchema = z.object({
    inspectionId: z.coerce.number().int().positive(),

});
export type GetBookingBelongToStaffQueryType = z.infer<typeof GetBookingBelongToStaffQuerySchema>;

export const CreateInspectionReportSchema = z.object({
    bookingId: z.number().int(),
    estimatedTime: z.number().int().optional(),
    note: z.string().optional(),
    images: z.array(z.string().url()),
})

export const StaffGetReviewQuerySchema = z.object({
    page: z.number().int().min(1).optional().default(1),
    limit: z.number().int().min(1).optional().default(10),
    rating: z.number().int().min(1).max(5).optional(),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
});
export const UpdateInspectionReportSchema = z.object({
    note: z.string().optional(),
    images: z.array(z.string().url()).optional(),
    estimatedTime: z.number().int().min(1).max(600).optional(),
});
export const GetRecentWorkLogsSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
});
export const GetBookingsByDateSchema = z.object({
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format',
    }),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
});