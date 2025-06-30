import { z } from 'zod';

// ================= ENUMS =================
export const GenderEnum = z.enum(['MALE', 'FEMALE', 'OTHER']);
export const BookingStatusEnum = z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']);
export const UserStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']);

// ================= UTILS =================
const vietnamPhoneRegex = /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$/;

const zodDate = () =>
    z.preprocess(
        (arg) => {
            if (typeof arg === 'string' || arg instanceof Date) {
                const date = new Date(arg);
                return isNaN(date.getTime()) ? undefined : date;
            }
            return undefined;
        },
        z.date({
            required_error: "REQUIRED_FIELD",
            invalid_type_error: "INVALID_FORMAT",
        })
    );

// ================= USER =================
export const userSchema = z.object({
    id: z.number(),
    email: z.string().email({ message: "INVALID_FORMAT" }),
    name: z.string()
        .min(2, { message: "MIN_LENGTH" })
        .max(50, { message: "MAX_LENGTH" }),
    phone: z.string().regex(vietnamPhoneRegex, { message: "INVALID_FORMAT" }),
    avatar: z.string().url({ message: "INVALID_FORMAT" }).nullable().optional(),
    status: UserStatusEnum,
    createdAt: zodDate(),
    updatedAt: zodDate(),
});

export const updateUserSchema = z.object({
    name: z.string()
        .min(2, { message: "MIN_LENGTH" })
        .max(50, { message: "MAX_LENGTH" })
        .optional(),
    phone: z.string().regex(vietnamPhoneRegex, { message: "INVALID_FORMAT" }).optional(),
    avatar: z.string().url({ message: "INVALID_FORMAT" }).nullable().optional(),
    status: UserStatusEnum.optional(),
});

// ================= SERVICE =================
export const serviceSchema = z.object({
    id: z.number(),
    name: z.string(),
});

// ================= SERVICE PROVIDER =================
export const serviceProviderSchema = z.object({
    id: z.number(),
});

// ================= BOOKING =================
export const bookingSchema = z.object({
    id: z.number(),
    status: BookingStatusEnum,
    date: zodDate(),
    note: z.string().nullable().optional(),
    createdAt: zodDate(),
    updatedAt: zodDate(),
    Service: serviceSchema,
    ServiceProvider: serviceProviderSchema,
});

// ================= CUSTOMER PROFILE =================
export const customerProfileSchema = z.object({
    id: z.number(),
    address: z.string().max(255, { message: "MAX_LENGTH" }).nullable().optional(),
    dateOfBirth: zodDate().nullable().optional(),
    gender: GenderEnum.nullable().optional(),
    createdAt: zodDate(),
    updatedAt: zodDate(),
    userId: z.number(),
});

// ================= UPDATE CUSTOMER PROFILE =================
export const updateCustomerProfileSchema = z.object({
    address: z.string().max(255, { message: "MAX_LENGTH" }).optional(),
    dateOfBirth: zodDate().optional(),
    gender: GenderEnum.optional(),
});

// ================= COMBINED UPDATE =================
export const updateUserAndCustomerProfileSchema = z.object({
    user: updateUserSchema.optional(),
    customer: updateCustomerProfileSchema.optional(),
});
export const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(6, 'Current password must be at least 6 characters'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmNewPassword: z.string().min(8, 'Confirmation password must be at least 8 characters'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match',
    path: ['confirmNewPassword'],
});



// ================= TYPE INFER =================
export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;
export type UserDto = z.infer<typeof userSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;

export type ServiceDto = z.infer<typeof serviceSchema>;
export type ServiceProviderDto = z.infer<typeof serviceProviderSchema>;
export type BookingDto = z.infer<typeof bookingSchema>;

export type CustomerProfileDto = z.infer<typeof customerProfileSchema>;
export type UpdateCustomerProfileDto = z.infer<typeof updateCustomerProfileSchema>;
export type UpdateUserAndCustomerProfileDto = z.infer<typeof updateUserAndCustomerProfileSchema>;
