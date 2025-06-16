import { createZodDto } from "nestjs-zod";
import { GetCustomerInformationParamsSchema } from "./user.model";

export class GetCustomerInformationParamsDTO extends createZodDto(GetCustomerInformationParamsSchema) { }