import { Body, Controller, HttpException, Inject, Patch } from "@nestjs/common";
import { handlerErrorResponse, handleZodError } from "libs/common/helpers";
import { USER_SERVICE } from "libs/common/src/constants/service-name.constant";
import { ActiveUser } from "libs/common/src/decorator/active-user.decorator";
import { UpdateUserAndCustomerProfileDTO } from "libs/common/src/request-response-type/customer/customer.dto";

import { RawTcpClientService } from "libs/common/src/tcp/raw-tcp-client.service";

@Controller('users')
export class UserGatewayController {
    constructor(
        @Inject(USER_SERVICE) private readonly userRawTcpClient: RawTcpClientService) { }
    @Patch('update-customer-information')
    async updateCustomer(@Body() body: UpdateUserAndCustomerProfileDTO, @ActiveUser("customerId") customerId: number) {
        try {
            const data = await this.userRawTcpClient.send({ type: 'UPDATE_CUSTOMER', data: { ...body }, customerId })
            handlerErrorResponse(data)
            return data
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error)
        }
    }
}