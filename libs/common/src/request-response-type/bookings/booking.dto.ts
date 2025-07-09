import { createZodDto } from "nestjs-zod";
import { AssignStaffToBookingBodySchema, CancelServiceRequestBodySchema, CreateServiceRequestBodySchema, GetServicesRequestQuerySchema } from "./booking.model";


export class GetServicesRequestQueryDTO extends createZodDto(GetServicesRequestQuerySchema) { }
export class AssignStaffToBookingBodyDTO extends createZodDto(AssignStaffToBookingBodySchema) { }
export class CreateServiceRequestBodySchemaDTO extends createZodDto(CreateServiceRequestBodySchema) { }
export class CancelServiceRequestBodyDTO extends createZodDto(CancelServiceRequestBodySchema) { }