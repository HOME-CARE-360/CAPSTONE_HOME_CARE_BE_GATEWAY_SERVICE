import { createZodDto } from "nestjs-zod"
import { GetListReportQuerySchema, UpdateProviderReportSchema } from "./report.model"

export class GetListReportQueryDTO extends createZodDto(GetListReportQuerySchema) { }
export class UpdateProviderReportDTO extends createZodDto(UpdateProviderReportSchema) { }
