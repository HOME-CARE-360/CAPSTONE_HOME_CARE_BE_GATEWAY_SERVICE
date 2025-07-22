import {
  Body,
  Controller,
  HttpException,
  Inject,
  Post,
} from '@nestjs/common';
import {
  handlerErrorResponse,
  handleZodError,
} from 'libs/common/helpers';
import { PAYMENT_SERVICE } from 'libs/common/src/constants/service-name.constant';
import { RawTcpClientService } from 'libs/common/src/tcp/raw-tcp-client.service';

import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
import { WalletTopUpDto } from 'libs/common/src/request-response-type/payment/payment.dto';

@Controller('payments')
export class PaymentGatewayController {
  constructor(
    @Inject(PAYMENT_SERVICE)
    private readonly paymentRawTcpClient: RawTcpClientService,
  ) {}

  @Post('create-topup')
  async createTopUp(
    @Body() body: WalletTopUpDto,
    @ActiveUser('userId') userId: number,
  ) {
    try {
      const data = await this.paymentRawTcpClient.send({
        type: 'CREATE_TOPUP',
        data: { ...body, userId },
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

//   @Get('callback/:orderCode/:status')
//   async handleCallback(
//     @Param('orderCode') orderCode: string,
//     @Param('status') status: 'PAID' | 'FAILED',
//   ) {
//     try {
//       const data = await this.paymentRawTcpClient.send({
//         type: 'HANDLE_CALLBACK',
//         orderCode,
//         status,
//       });
//       handlerErrorResponse(data);
//       return data;
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       handleZodError(error);
//     }
//   }
}
