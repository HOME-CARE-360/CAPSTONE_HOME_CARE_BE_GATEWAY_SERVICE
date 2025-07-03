import { Body, Controller, Get, HttpException, Inject, Param, Patch } from "@nestjs/common";
import { handlerErrorResponse, handleZodError } from "libs/common/helpers";
import { USER_SERVICE } from "libs/common/src/constants/service-name.constant";
import { ActiveUser } from "libs/common/src/decorator/active-user.decorator";
import { ChangePasswordDTO } from "libs/common/src/request-response-type/customer/customer.dto";

import { RawTcpClientService } from "libs/common/src/tcp/raw-tcp-client.service";
import { AccessTokenPayload } from "libs/common/src/types/jwt.type";

@Controller('publics')
export class PublicGatewayController {
    constructor(
        @Inject(USER_SERVICE) private readonly userRawTcpClient: RawTcpClientService) { }
    @Get('get-staff-information/:staffId')
    async getStaffInformation(@Param("staffId") staffId: number) {
        try {
            const data = await this.userRawTcpClient.send({ type: 'GET_STAFF', staffId: Number(staffId) })
            console.log(data);
            return data
        } catch (error) {
            handleZodError(error)
        }
    }
    @Get('get-customer-information/:customerId')
    async changeStatusProvider(@Param("customerId") customerId: number) {
        try {
            return await this.userRawTcpClient.send({ type: 'GET_CUSTOMER', customerId: Number(customerId) })
        } catch (error) {
            handleZodError(error)
        }

    } @Get('get-service-provider-information/:providerId')
    async getServiceProviderInformation(@Param("providerId") providerId: number) {
        try {
            const data = await this.userRawTcpClient.send({ type: 'GET_SERVICE_PROVIDER', providerId: Number(providerId) })
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
            handlerErrorResponse(data)
            return data
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error)
        }
    }
    @Get('get-me')
    async getMe(@ActiveUser() user: AccessTokenPayload) {
        const keyName = (user.customerId && 'customerId' || user.providerId && "providerId" || user.staffId && "staffId") as string
        const value = user.customerId || user.providerId || user.staffId
        try {
            const data = await this.userRawTcpClient.send({ type: 'GET_ME', [keyName]: value })
            return data
        } catch (error) {
            handleZodError(error)
        }
    }


}