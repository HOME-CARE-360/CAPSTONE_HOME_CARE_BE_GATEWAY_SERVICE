import { Body, Controller, Get, Inject, Param, Patch } from "@nestjs/common";
import { handleZodError } from "libs/common/helpers";
import { USER_SERVICE } from "libs/common/src/constants/service-name.constant";
import { ActiveUser } from "libs/common/src/decorator/active-user.decorator";
import { ChangePasswordDto, UpdateCustomerProfileDto } from "libs/common/src/request-response-type/customer/customer.model";

import { GetCustomerInformationParamsDTO } from "libs/common/src/request-response-type/user/user.dto";
import { RawTcpClientService } from "libs/common/src/tcp/raw-tcp-client.service";

@Controller('users')
export class UserGatewayController {
    constructor(
        @Inject(USER_SERVICE) private readonly userRawTcpClient: RawTcpClientService) { }
    @Get('get-customer-information/:userId')
    async changeStatusProvider(@Param() params: GetCustomerInformationParamsDTO) {
        try {
            return await this.userRawTcpClient.send({ type: 'GET_CUSTOMER', userId: params.userId, })
        } catch (error) {
            handleZodError(error)
        }

    }

    @Patch('update-customer-information')
    async updateCustomer(@Body() body: UpdateCustomerProfileDto, @ActiveUser("userId") userId: number) {
        try {
            return await this.userRawTcpClient.send({ type: 'UPDATE_CUSTOMER', data: { ...body }, userId })
        } catch (error) {
            handleZodError(error)
        }
    }
    @Patch('change-password')
    async changePassword(@Body() body: ChangePasswordDto, @ActiveUser("userId") userId: number) {
        try {
            return await this.userRawTcpClient.send({ type: 'CHANGE-PASSWORD', data: { ...body }, userId })
        } catch (error) {
            handleZodError(error)
        }
    }

}