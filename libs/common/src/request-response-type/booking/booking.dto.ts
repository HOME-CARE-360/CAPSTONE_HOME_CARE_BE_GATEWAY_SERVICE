import { createZodDto } from "nestjs-zod";
import { CreateServiceRequestBodySchema } from "./booking.model";
import { GetServicesRequestQuerySchema } from "./booking.model";
export class CreateServiceRequestBodyDTO extends createZodDto(CreateServiceRequestBodySchema) { }



export class GetServicesRequestQueryDTO extends createZodDto(GetServicesRequestQuerySchema) { }