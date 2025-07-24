import { createZodDto } from "nestjs-zod";
import { CustomerCompleteBookingSchema, GetCustomerInformationParamsSchema, LinkBankAccountSchema } from "./user.model";

export class GetCustomerInformationParamsDTO extends createZodDto(GetCustomerInformationParamsSchema) { }
export class LinkBankAccountDTO extends createZodDto(LinkBankAccountSchema) { }
export class CustomerCompleteBookingDTO extends createZodDto(CustomerCompleteBookingSchema) { };
