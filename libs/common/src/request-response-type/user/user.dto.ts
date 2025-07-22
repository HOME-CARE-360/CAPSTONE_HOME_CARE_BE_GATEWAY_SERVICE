import { createZodDto } from "nestjs-zod";
import { GetCustomerInformationParamsSchema, LinkBankAccountSchema } from "./user.model";

export class GetCustomerInformationParamsDTO extends createZodDto(GetCustomerInformationParamsSchema) { }
export class LinkBankAccountDTO extends createZodDto(LinkBankAccountSchema) { }
