import { Controller, Inject, Param, Post } from "@nestjs/common";
import { handleZodError } from "libs/common/helpers";
import { USER_SERVICE } from "libs/common/src/constants/service-name.constant";
import { IsPublic } from "libs/common/src/decorator/auth.decorator";

import { GetCustomerInformationParamsDTO } from "libs/common/src/request-response-type/user/user.dto";
import { RawTcpClientService } from "libs/common/src/tcp/raw-tcp-client.service";

@Controller('users')
export class UserGatewayController {
    constructor(
        @Inject(USER_SERVICE) private readonly userRawTcpClient: RawTcpClientService) { }
    @IsPublic()
    @Post('get-customer-information/:userId')
    async changeStatusProvider(@Param() params: GetCustomerInformationParamsDTO) {
        try {
            return await this.userRawTcpClient.send({ type: 'GET_CUSTOMER', userId: params.userId, })
        } catch (error) {
            handleZodError(error)
        }

    }
}