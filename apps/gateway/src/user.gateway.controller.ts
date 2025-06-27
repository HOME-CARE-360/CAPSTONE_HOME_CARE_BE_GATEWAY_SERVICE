import { Body, Controller, Inject, Patch } from "@nestjs/common";
import { handleZodError } from "libs/common/helpers";
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
            return await this.userRawTcpClient.send({ type: 'UPDATE_CUSTOMER', data: { ...body }, customerId })
        } catch (error) {
            handleZodError(error)
        }
    }
}