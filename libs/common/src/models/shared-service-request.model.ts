import { RequestStatus } from '@prisma/client'
import { z } from 'zod'


export const ServiceRequestSchema = z.object({
    id: z.number(),
    customerId: z.number(),
    providerId: z.number(),
    note: z.string().nullable().optional(),
    preferredDate: z.coerce.date(),
    location: z.string().max(500),
    categoryId: z.number(),
    status: z.enum([RequestStatus.BOOKED, RequestStatus.ESTIMATED, RequestStatus.IN_PROGRESS, RequestStatus.REJECTED, RequestStatus.PENDING]),
    createdAt: z.date(),
    updatedAt: z.date(),
    phoneNumber: z.string(),
})

export type ServiceRequestType = z.infer<typeof ServiceRequestSchema>
