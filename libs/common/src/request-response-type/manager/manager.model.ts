
import { ServiceProviderSchema } from "libs/common/src/models/shared-provider.model";
import { z } from "zod";
import { ServiceSchema } from "../../models/shared-services.model";
export const UpdateStatusProviderBodySchema = ServiceProviderSchema.pick({
    id: true,
    verificationStatus: true
}).strict()
export const UpdateStatusServiceBodySchema = ServiceSchema.pick({
    id: true,
    status: true
}).strict()

export type UpdateStatusServiceBodyType = z.infer<typeof UpdateStatusServiceBodySchema>
export type UpdateStatusProviderBodyType = z.infer<typeof UpdateStatusProviderBodySchema>