import { Body, Controller, Get, Inject, Param, Patch } from "@nestjs/common";
import { handleZodError } from "libs/common/helpers";
import { USER_SERVICE } from "libs/common/src/constants/service-name.constant";
import { ActiveUser } from "libs/common/src/decorator/active-user.decorator";
import { ChangePasswordDTO, UpdateUserAndCustomerProfileDTO } from "libs/common/src/request-response-type/customer/customer.dto";
import { UpdateUserAndStaffProfileDTO } from "libs/common/src/request-response-type/staff/staff.dto";

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
    async updateCustomer(@Body() body: UpdateUserAndCustomerProfileDTO, @ActiveUser("userId") userId: number) {
        try {
            return await this.userRawTcpClient.send({ type: 'UPDATE_CUSTOMER', data: { ...body }, userId })
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
    @Get('get-staff-information')
    async getStaffInformation(@ActiveUser("userId") userId: number) {
        try {
            const data = await this.userRawTcpClient.send({ type: 'GET_STAFF', userId })
            console.log(data);
            return data
        } catch (error) {
            handleZodError(error)
        }
    }
    @Patch('update-staff-information')
    async getUserInformation(@Body() body: UpdateUserAndStaffProfileDTO, @ActiveUser("userId") userId: number) {
        try {
            const data = await this.userRawTcpClient.send({ type: 'UPDATE_STAFF', userId, data: { ...body } })
            console.log(data);
            return data
        } catch (error) {
            handleZodError(error)
        }
    }

    @Get('get-service-provider-information')
    async getServiceProviderInformation(@ActiveUser("userId") userId: number) {
        try {
            const data = await this.userRawTcpClient.send({ type: 'GET_SERVICE_PROVIDER', userId })
            console.log(data);
            return data
        } catch (error) {
            handleZodError(error)
        }
    }
    @Patch('update-service-provider-information')
    async updateServiceProviderInformation(@Body() body: UpdateUserAndStaffProfileDTO, @ActiveUser("userId") userId: number) {
        try {
            const data = await this.userRawTcpClient.send({ type: 'UPDATE_SERVICE_PROVIDER', userId, data: { ...body } })
            console.log(data);
            return data
        } catch (error) {
            handleZodError(error)
        }
    }
}