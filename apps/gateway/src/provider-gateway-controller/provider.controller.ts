import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiQuery } from '@nestjs/swagger';
import { handlerErrorResponse, handleZodError } from 'libs/common/helpers';
import {
  PROVIDER_SERVICE,
  USER_SERVICE,
} from 'libs/common/src/constants/service-name.constant';
import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
import { VerifiedProviderGuard } from 'libs/common/src/guards/verified-provider.guard';
import { GetProviderStatsQueryType } from 'libs/common/src/request-response-type/dashboard/dashboard.model';
import { UpdateUserAndStaffProfileDTO } from 'libs/common/src/request-response-type/staff/staff.dto';
import { RawTcpClientService } from 'libs/common/src/tcp/raw-tcp-client.service';
import { lastValueFrom } from 'rxjs';
export enum GranularitySwaggerEnum {
  day = 'day',
  week = 'week',
  month = 'month',
}
@Controller('providers')
@UseGuards(VerifiedProviderGuard)
export class UserGatewayController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userRawTcpClient: RawTcpClientService,
    @Inject(PROVIDER_SERVICE) private readonly providerClient: ClientProxy,
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
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    format: 'date-time',
    example: '2025-07-22T00:00:00.000Z',
    description: 'Nếu trống sẽ default theo Zod preprocess.',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    format: 'date-time',
    example: '2025-08-20T23:59:59.999Z',
    description: 'Nếu trống sẽ default theo Zod preprocess.',
  })
  @ApiQuery({
    name: 'granularity',
    required: false,
    enum: GranularitySwaggerEnum,
    example: GranularitySwaggerEnum.day,
    description: 'Mặc định: day',
  })
  @Get('dashboard')
  async getStatsMsg(
    @Query() params: GetProviderStatsQueryType,
    @ActiveUser('providerId') providerId: number,
  ) {
    {
      try {
        return await lastValueFrom(
          this.providerClient.send(
            { cmd: 'dashboard' },
            {
              providerId,
              params,
            },
          ),
        );
      } catch (error) {
        console.log(error);

        handleZodError(error);
      }
    }
  }
}
