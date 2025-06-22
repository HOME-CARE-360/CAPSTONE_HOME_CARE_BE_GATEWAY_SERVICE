import { Body, Controller, Inject, Post, } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { handleZodError } from "libs/common/helpers";
import { BOOKING_SERVICE } from "libs/common/src/constants/service-name.constant";
import { ZodSerializerDto } from "nestjs-zod";
import { lastValueFrom } from "rxjs";
import { GetListCategoryResDTO } from "libs/common/src/request-response-type/category/category.dto";
import { ActiveUser } from "libs/common/src/decorator/active-user.decorator";
import { CreateServiceRequestBodyDTO } from "libs/common/src/request-response-type/booking/booking.dto";

@Controller('bookings')
export class BookingsGatewayController {
    constructor(
        @Inject(BOOKING_SERVICE) private readonly bookingClient: ClientProxy
    ) { }
    @Post('create-service-request')
    @ZodSerializerDto(GetListCategoryResDTO)
    async getListService(@Body() body: CreateServiceRequestBodyDTO, @ActiveUser("userId") userId: number) {
        try {
            return await lastValueFrom(this.bookingClient.send({ cmd: 'create-service-request' }, { body, userId }));
        } catch (error) {
            handleZodError(error)


        }

    }
}
