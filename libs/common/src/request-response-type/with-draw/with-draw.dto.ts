import { createZodDto } from "nestjs-zod";
import { GetListWidthDrawQuerySchema, GetWidthDrawDetailParamsSchema } from "./with-draw.model";

export class GetListWidthDrawQueryDTO extends createZodDto(GetListWidthDrawQuerySchema) { }
export class GetWidthDrawDetailParamsDTO extends createZodDto(GetWidthDrawDetailParamsSchema) { }