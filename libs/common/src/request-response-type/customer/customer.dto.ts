import { createZodDto } from "nestjs-zod";
import { ChangePasswordSchema, updateUserAndCustomerProfileSchema } from "./customer.model";

export class ChangePasswordDTO extends createZodDto(ChangePasswordSchema) { }
export class UpdateUserAndCustomerProfileDTO extends createZodDto(updateUserAndCustomerProfileSchema) { }
