import { createZodDto } from "nestjs-zod";
import { CreateServiceItemSchema, GetServiceItemsQuerySchema } from "./service-item.model";

export class CreateServiceItemDTO extends createZodDto(CreateServiceItemSchema) { }
export class GetServiceItemsQueryDTO extends createZodDto(GetServiceItemsQuerySchema) { }

