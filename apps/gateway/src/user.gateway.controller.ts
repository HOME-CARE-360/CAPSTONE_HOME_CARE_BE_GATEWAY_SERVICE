import { Controller, Inject, Param, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { handleZodError } from "libs/common/helpers";
import { USER_SERVICE } from "libs/common/src/constants/service-name.constant";
import { IsPublic } from "libs/common/src/decorator/auth.decorator";

import { lastValueFrom } from "rxjs";
import { GetCustomerInformationParamsDTO } from "libs/common/src/request-response-type/user/user.dto";

@Controller('users')
export class UserGatewayController {
    constructor(
        @Inject(USER_SERVICE) private readonly userClient: ClientProxy
    ) { }
    @IsPublic()
    @Post('get-customer-information/:userId')
    async changeStatusProvider(@Param() params: GetCustomerInformationParamsDTO) {
        try {
            return await lastValueFrom(this.userClient.send({ type: 'GET_CUSTOMER' }, { userId: params.userId }));
        } catch (error) {
            handleZodError(error)
        }

    }
}