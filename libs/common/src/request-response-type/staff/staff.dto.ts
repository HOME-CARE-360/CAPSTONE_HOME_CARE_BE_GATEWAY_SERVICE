import { createZodDto } from "nestjs-zod";
import { updateUserAndStaffProfileSchema } from "./staff.model";

export class UpdateUserAndStaffProfileDTO extends createZodDto(updateUserAndStaffProfileSchema) { }