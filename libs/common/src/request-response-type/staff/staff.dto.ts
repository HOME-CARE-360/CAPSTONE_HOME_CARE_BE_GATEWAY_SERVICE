import { createZodDto } from "nestjs-zod";
import { CreateInspectionReportSchema, GetBookingBelongToStaffQuerySchema, getBookingDetailSchema, StaffGetReviewQuerySchema, updateUserAndStaffProfileSchema } from "./staff.model";

export class UpdateUserAndStaffProfileDTO extends createZodDto(updateUserAndStaffProfileSchema) { }
export class GetBookingBelongToStaffQueryDTO extends createZodDto(GetBookingBelongToStaffQuerySchema) { }
export class CreateInspectionReportDTO extends createZodDto(CreateInspectionReportSchema) { }
export class GetBookingDetailDTO extends createZodDto(getBookingDetailSchema) { }
export class StaffGetReviewQueryDTO extends createZodDto(StaffGetReviewQuerySchema) { }


