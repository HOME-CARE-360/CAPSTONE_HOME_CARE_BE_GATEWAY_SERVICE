import { Body, Controller, Inject, Patch } from "@nestjs/common";
import { handleZodError } from "libs/common/helpers";
import { USER_SERVICE } from "libs/common/src/constants/service-name.constant";
import { ActiveUser } from "libs/common/src/decorator/active-user.decorator";
import { UpdateUserAndStaffProfileDTO } from "libs/common/src/request-response-type/staff/staff.dto";
import { RawTcpClientService } from "libs/common/src/tcp/raw-tcp-client.service";

@Controller('providers')
export class UserGatewayController {
    constructor(
        @Inject(USER_SERVICE) private readonly userRawTcpClient: RawTcpClientService) { }

    @Patch('update-service-provider-information')
    async updateServiceProviderInformation(@Body() body: UpdateUserAndStaffProfileDTO, @ActiveUser("providerId") providerId: number) {
        try {
            const data = await this.userRawTcpClient.send({ type: 'UPDATE_SERVICE_PROVIDER', providerId, data: { ...body } })
            console.log(data);
            return data
        } catch (error) {
            handleZodError(error)
        }
    }
}