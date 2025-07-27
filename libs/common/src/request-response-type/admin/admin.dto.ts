import { createZodDto } from 'nestjs-zod';
import {
  AssignPermissionsToRoleSchema,
  AssignRolesSchema,
  CreateRoleSchema,
  CreateUserSchema,
  DeleteRoleSchema,
  GetUsersQuerySchema,
  IdParamSchema,
  MonthlyReportSchema,
  MultiMonthReportSchema,
  ResetPasswordSchema,
  UpdateRoleSchema,
  UpdateUserSchema,
} from 'libs/common/src/request-response-type/admin/admin.model';

// === USER MANAGEMENT DTOs ===
export class CreateUserDTO extends createZodDto(CreateUserSchema) {}
export class UpdateUserDTO extends createZodDto(UpdateUserSchema) {}
export class ResetPasswordDTO extends createZodDto(ResetPasswordSchema) {}

// === ROLE MANAGEMENT DTOs ===
export class CreateRoleDTO extends createZodDto(CreateRoleSchema) {}
export class UpdateRoleDTO extends createZodDto(UpdateRoleSchema) {}
export class DeleteRoleDTO extends createZodDto(DeleteRoleSchema) {}
export class AssignPermissionsToRoleDTO extends createZodDto(
  AssignPermissionsToRoleSchema,
) {}

// === USER ROLE ASSIGNMENT DTOs ===
export class AssignRolesDTO extends createZodDto(AssignRolesSchema) {}

// === QUERY & PARAM DTOs ===
export class GetUsersQuery extends createZodDto(GetUsersQuerySchema) {}
export class IdParamDTO extends createZodDto(IdParamSchema) {}

// === REPORT DTOs ===
export class MonthlyReportDTO extends createZodDto(MonthlyReportSchema) {}
export class MultiMonthReportDTO extends createZodDto(MultiMonthReportSchema) {}
