import { Body, Controller, Get, Inject, Param, Patch } from "@nestjs/common";
import { handleZodError } from "libs/common/helpers";
import { USER_SERVICE } from "libs/common/src/constants/service-name.constant";
import { ActiveUser } from "libs/common/src/decorator/active-user.decorator";
import { ChangePasswordDTO } from "libs/common/src/request-response-type/customer/customer.dto";
import { GetCustomerInformationParamsDTO } from "libs/common/src/request-response-type/user/user.dto";

import { RawTcpClientService } from "libs/common/src/tcp/raw-tcp-client.service";

@Controller('publics')
export class PublicGatewayController {
    constructor(
        @Inject(USER_SERVICE) private readonly userRawTcpClient: RawTcpClientService) { }
    @Get('get-staff-information/:staffId')
    async getStaffInformation(@Param("staffId") staffId: number) {
        try {
            const data = await this.userRawTcpClient.send({ type: 'GET_STAFF', staffId })
            console.log(data);
            return data
        } catch (error) {
            handleZodError(error)
        }
    }
    @Get('get-customer-information/:customerId')
    async changeStatusProvider(@Param("customerId") customerId: number) {
        try {
            return await this.userRawTcpClient.send({ type: 'GET_CUSTOMER', customerId })
        } catch (error) {
            handleZodError(error)
        }

    } @Get('get-service-provider-information/:providerId')
    async getServiceProviderInformation(@Param("providerId") providerId: number) {
        try {
            const data = await this.userRawTcpClient.send({ type: 'GET_SERVICE_PROVIDER', providerId })
            console.log(data);
            return data
        } catch (error) {
            handleZodError(error)
        }
    }
    @Patch('change-password')
    async changePassword(@Body() body: ChangePasswordDTO, @ActiveUser("userId") userId: number) {
        try {
            const data = await this.userRawTcpClient.send({ type: 'CHANGE_PASSWORD', data: { ...body }, userId })
            console.log(data);
            return data
        } catch (error) {
            console.log("hi");

            console.log(error);

            handleZodError(error)
        }
    }


}