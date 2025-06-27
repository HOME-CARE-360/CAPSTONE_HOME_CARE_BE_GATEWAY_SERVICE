import { createZodDto } from "nestjs-zod";
import { updateUserAndServiceProviderProfileSchema } from "./provider.model";

export class UpdateUserAndServiceProviderProfileDTO extends createZodDto(updateUserAndServiceProviderProfileSchema) { }