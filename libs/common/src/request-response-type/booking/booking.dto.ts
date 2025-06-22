import { createZodDto } from "nestjs-zod";
import { CreateServiceRequestBodySchema } from "./booking.model";

export class CreateServiceRequestBodyDTO extends createZodDto(CreateServiceRequestBodySchema) { }