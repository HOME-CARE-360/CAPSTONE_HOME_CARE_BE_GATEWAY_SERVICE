import { z } from 'zod';

export const UserStatus = z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED']);

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1),
  phone: z.string().min(6).max(20),
  avatar: z.string().url().optional(),
  status: UserStatus.default('ACTIVE'),
  role: z.literal('MANAGER'),
});

export const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
  status: UserStatus.optional(),
  roleIds: z.array(z.number().int().positive()).optional(),
});

export const IdParamSchema = z.object({
  id: z.number().int().positive(),
});

export const allowedUserSortFields = [
  'id',
  'email',
  'name',
  'phone',
  'createdAt',
  'updatedAt',
] as const;

export const GetUsersQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  status: UserStatus.optional(),
  sortBy: z.enum(allowedUserSortFields).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const AssignRolesSchema = z.object({
  roleIds: z.array(z.number().int().positive()),
});

export const ResetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const CreateRoleSchema = z.object({
  name: z.string().min(1),
});

export const UpdateRoleSchema = z.object({
  name: z.string().min(1),
});

export const DeleteRoleSchema = z.object({
  id: z.number().int().positive(),
});

export const AssignPermissionsToRoleSchema = z.object({
  permissionIds: z.array(z.number().int().positive()),
});

export const MonthlyReportSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000),
});

export const MultiMonthReportSchema = z.object({
  startMonth: z.number().int().min(1).max(12),
  startYear: z.number().int().min(2000),
  endMonth: z.number().int().min(1).max(12),
  endYear: z.number().int().min(2000),
});
