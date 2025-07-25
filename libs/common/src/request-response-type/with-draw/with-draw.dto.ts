import { createZodDto } from "nestjs-zod";
import { GetListWidthDrawQuerySchema } from "./with-draw.model";

export class GetListWidthDrawQueryDTO extends createZodDto(GetListWidthDrawQuerySchema) { }