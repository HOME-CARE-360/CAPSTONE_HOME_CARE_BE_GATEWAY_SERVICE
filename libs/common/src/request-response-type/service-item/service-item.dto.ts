import { createZodDto } from "nestjs-zod";
import { CreateServiceItemSchema, GetServiceItemParamsSchema } from "./service-item.model";

export class CreateServiceItemDTO extends createZodDto(CreateServiceItemSchema) { }
export class GetServiceItemParamsDTO extends createZodDto(GetServiceItemParamsSchema) { }

