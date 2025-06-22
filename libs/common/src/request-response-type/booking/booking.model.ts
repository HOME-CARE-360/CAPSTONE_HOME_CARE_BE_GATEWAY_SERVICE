import { z } from "zod";

import { PaymentMethod } from "@prisma/client";
import { ServiceRequestSchema } from "../../models/shared-service-request.model";
import { BookingSchema } from "../../models/shared-booking.model";

export const CreateServiceRequestBodySchema = ServiceRequestSchema.omit({
    updatedAt: true,
    createdAt: true,
    status: true,
    id: true
}).extend({
    paymentMethod: z.enum([PaymentMethod.BANK_TRANSFER, PaymentMethod.CREDIT_CARD])
}).strict()
export const CreateBookingBodySchema = BookingSchema.omit({
    updatedAt: true,
    createdAt: true,
    id: true
}).strict()
export type CreateServiceRequestBodyType = z.infer<typeof CreateServiceRequestBodySchema>
export type CreateBookingBodyType = z.infer<typeof CreateBookingBodySchema>