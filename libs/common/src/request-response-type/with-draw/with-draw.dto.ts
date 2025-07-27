import { createZodDto } from "nestjs-zod";
import { GetListWidthDrawQuerySchema, GetWidthDrawDetailParamsSchema, UpdateWithDrawalBodySchema } from "./with-draw.model";

export class GetListWidthDrawQueryDTO extends createZodDto(GetListWidthDrawQuerySchema) { }
export class GetWidthDrawDetailParamsDTO extends createZodDto(GetWidthDrawDetailParamsSchema) { }
export class UpdateWithDrawalBodyDTO extends createZodDto(UpdateWithDrawalBodySchema) { }
