import { Body, Controller, Inject, Patch, } from '@nestjs/common';
import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
import { USER_SERVICE } from 'libs/common/src/constants/service-name.constant';

import { handleZodError } from 'libs/common/helpers';

import { RawTcpClientService } from 'libs/common/src/tcp/raw-tcp-client.service';
import { UpdateUserAndStaffProfileDTO } from 'libs/common/src/request-response-type/staff/staff.dto';
@Controller('staffs')
export class StaffGatewayController {
    constructor(@Inject(USER_SERVICE) private readonly userRawTcpClient: RawTcpClientService) { }

    @Patch('update-staff-information')
    async getUserInformation(@Body() body: UpdateUserAndStaffProfileDTO, @ActiveUser("staffId") staffId: number) {
        try {
            const data = await this.userRawTcpClient.send({ type: 'UPDATE_STAFF', staffId, data: { ...body } })
            console.log(data);
            return data
        } catch (error) {
            handleZodError(error)
        }
    }

}
