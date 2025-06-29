import { createZodDto } from "nestjs-zod";
import { CreateInspectionReportSchema, GetBookingBelongToStaffQuerySchema, GetBookingDetailSchema, GetInspectionDetailSchema, GetRecentWorkLogsSchema, StaffGetReviewQuerySchema, UpdateInspectionReportSchema, updateUserAndStaffProfileSchema } from "./staff.model";

export class UpdateUserAndStaffProfileDTO extends createZodDto(updateUserAndStaffProfileSchema) { }
export class GetBookingBelongToStaffQueryDTO extends createZodDto(GetBookingBelongToStaffQuerySchema) { }
export class CreateInspectionReportDTO extends createZodDto(CreateInspectionReportSchema) { }
export class GetBookingDetailDTO extends createZodDto(GetBookingDetailSchema) { }
export class StaffGetReviewQueryDTO extends createZodDto(StaffGetReviewQuerySchema) { }
export class GetInspectionDetailDTO extends createZodDto(GetInspectionDetailSchema) { }
export class UpdateInspectionReportDTO extends createZodDto(UpdateInspectionReportSchema) { }
export class GetRecentWorkLogsDTO extends createZodDto(GetRecentWorkLogsSchema) { }

