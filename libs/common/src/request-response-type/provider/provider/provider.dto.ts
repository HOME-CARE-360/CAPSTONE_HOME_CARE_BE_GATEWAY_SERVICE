import { createZodDto } from "nestjs-zod";
import { updateUserAndServiceProviderProfileSchema } from "./provider.model";

export class updateUserAndServiceProviderProfileDTO extends createZodDto(updateUserAndServiceProviderProfileSchema) { }