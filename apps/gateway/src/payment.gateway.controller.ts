import { Body, Controller, HttpException, Inject, Post } from '@nestjs/common';
import { handlerErrorResponse, handleZodError } from 'libs/common/helpers';
import { PAYMENT_SERVICE } from 'libs/common/src/constants/service-name.constant';
import { RawTcpClientService } from 'libs/common/src/tcp/raw-tcp-client.service';

import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
import { IsPublic } from 'libs/common/src/decorator/auth.decorator';
import { ApiBody } from '@nestjs/swagger';

@Controller('payments')
export class PaymentGatewayController {
  constructor(
    @Inject(PAYMENT_SERVICE)
    private readonly paymentRawTcpClient: RawTcpClientService,
  ) {}

  @Post('create-topup')
  @ApiBody({
  schema: {
    type: 'object',
    properties: {
      amount: { type: 'number', example: 100000 },
    },
    required: ['amount'],
  },
})
  async createTopUp(
    @Body() body: { amount: number },
    @ActiveUser('userId') userId: number,
  ) {
    try {
      const data = await this.paymentRawTcpClient.send({
        type: 'CREATE_TOPUP',
   data: {
          ...body,
          userId,
        },
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @IsPublic()
  @Post('callback')
  async handlePayOSCallback(@Body() payload: any) {
    if (!payload.orderCode || !payload.status) {
      return { success: false };
    }
    try {
      const data = await this.paymentRawTcpClient.send({
        type: 'HANDLE_PAYOS_CALLBACK',
        data: {
          orderCode: payload.orderCode,
          status: payload.status,
        },
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }
}
