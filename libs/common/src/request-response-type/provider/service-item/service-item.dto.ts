import { createZodDto } from 'nestjs-zod';
import {
  CreateServiceItemSchema,
  GetServiceItemParamsSchema,
  GetServiceItemsQuerySchema,
  UpdateServiceItemSchema,
} from './service-item.model';

export class CreateServiceItemDTO extends createZodDto(
  CreateServiceItemSchema,
) { }

export class UpdateServiceItemDTO extends createZodDto(
  UpdateServiceItemSchema,
) { }
export class GetServiceItemsQueryDTO extends createZodDto(
  GetServiceItemsQuerySchema,
) { }
export class GetServiceItemParamsDTO extends createZodDto(
  GetServiceItemParamsSchema,
) { }
