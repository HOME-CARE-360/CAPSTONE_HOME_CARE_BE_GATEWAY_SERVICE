import { ServiceProviderSchema } from 'libs/common/src/models/shared-provider.model';
import { z } from 'zod';
import { ServiceSchema } from '../../models/shared-services.model';
export const UpdateStatusProviderBodySchema = ServiceProviderSchema.pick({
  id: true,
  verificationStatus: true,
}).strict();
export const UpdateStatusServiceBodySchema = ServiceSchema.pick({
  id: true,
  status: true,
}).strict();
export const GetListProviderQuerySchema = ServiceProviderSchema.pick({
  verificationStatus: true,
  taxId: true,
  licenseNo: true,
  companyType: true,
})
  .extend({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
  })
  .partial();
export type GetListProviderQueryType = z.infer<
  typeof GetListProviderQuerySchema
>;
export type UpdateStatusServiceBodyType = z.infer<
  typeof UpdateStatusServiceBodySchema
>;
export type UpdateStatusProviderBodyType = z.infer<
  typeof UpdateStatusProviderBodySchema
>;
