import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { handlerErrorResponse, handleZodError } from 'libs/common/helpers';
import { USER_SERVICE } from 'libs/common/src/constants/service-name.constant';
import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
import { VerifiedProviderGuard } from 'libs/common/src/guards/verified-provider.guard';
import { UpdateUserAndStaffProfileDTO } from 'libs/common/src/request-response-type/staff/staff.dto';
import { RawTcpClientService } from 'libs/common/src/tcp/raw-tcp-client.service';

@Controller('providers')
@UseGuards(VerifiedProviderGuard)
export class UserGatewayController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userRawTcpClient: RawTcpClientService,
  ) {}

  @Patch('update-service-provider-information')
  async updateServiceProviderInformation(
    @Body() body: UpdateUserAndStaffProfileDTO,
    @ActiveUser('providerId') providerId: number,
  ) {
    try {
      const data = await this.userRawTcpClient.send({
        type: 'UPDATE_SERVICE_PROVIDER',
        providerId,
        data: { ...body },
      });
      console.log(data);
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Get('reviews')
  async getReviewsByProviderId(@ActiveUser('providerId') providerId: number) {
    try {
      const data = await this.userRawTcpClient.send({
        type: 'GET_REVIEWS_BY_PROVIDER_ID',
        providerId,
      });
      console.log('[getReviewsByProviderId]', data);
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }
}
