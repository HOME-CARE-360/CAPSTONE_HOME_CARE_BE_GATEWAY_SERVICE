import { createZodDto } from "nestjs-zod";
import { getBookingBelongToStaffQuerySchema, updateUserAndStaffProfileSchema } from "./staff.model";

export class UpdateUserAndStaffProfileDTO extends createZodDto(updateUserAndStaffProfileSchema) { }
export class GetBookingBelongToStaffQueryDTO extends createZodDto(getBookingBelongToStaffQuerySchema) { }
