import { createZodDto } from "nestjs-zod";
import { UpdateStatusProviderBodySchema, UpdateStatusServiceBodySchema } from "./manager.model";

export class UpdateStatusProviderBodyDTO extends createZodDto(UpdateStatusProviderBodySchema) { }
export class UpdateStatusServiceBodyDTO extends createZodDto(UpdateStatusServiceBodySchema) { }