import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import { handlerErrorResponse, handleZodError } from 'libs/common/helpers';
import { PAYMENT_SERVICE } from 'libs/common/src/constants/service-name.constant';
import { RawTcpClientService } from 'libs/common/src/tcp/raw-tcp-client.service';

import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
import { IsPublic } from 'libs/common/src/decorator/auth.decorator';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';

@ApiTags('payments') // Add Swagger tag for better organization
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
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      orderCode: { type: 'string', example: '1234567890' },
      status: { type: 'string', enum: ['PAID', 'FAILED'], example: 'PAID' },
    },
    required: ['orderCode', 'status'],
  },
})
async handlePayOSCallback(@Body() payload: any) {
  
 const orderCodeStr = String(payload.data.orderCode);

console.log('Received PayOS callback:', orderCodeStr, 'Type:', typeof orderCodeStr);

let status: 'PAID' | 'FAILED';
if (payload.code === '00') {
  status = 'PAID';
} else {
  status = 'FAILED';
}

console.log(`Payment status determined: ${status}`, 'Type:', typeof status);

  if (!payload.data.orderCode) {
    throw new HttpException(
      {
        success: false,
        message: 'Invalid callback payload',
        error: 'Bad Request',
      },
      400,
    );
  }

  

  try {
    const data = await this.paymentRawTcpClient.send({
      type: 'HANDLE_PAYOS_CALLBACK',
      data: {
        orderCode: payload.data.orderCode,
        status,
      },
    });
    handlerErrorResponse(data);
    return data;
  } catch (error) {
    if (error instanceof HttpException) throw error;
    handleZodError(error);
  }
}


  @Post('create-proposal-transaction')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        bookingId: { type: 'number', example: 123 },
        method: {
          type: 'string',
          enum: Object.values(PaymentMethod),
          example: PaymentMethod.BANK_TRANSFER,
        },
      },
      required: ['bookingId'],
    },
  })
  async createProposalTransaction(
    @Body() body: { bookingId: number; method?: PaymentMethod },
    @ActiveUser('userId') userId: number,
  ) {
    try {
      console.log('Creating proposal transaction with body:', body);
      const data = await this.paymentRawTcpClient.send({
        type: 'CREATE_PROPOSAL_TRANSACTION',
        data: {
          bookingId: body.bookingId,
          method: body.method,
          userId,
        },
      });
      console.log('Proposal transaction created successfully:', data);
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }
  @Get('status')
  @ApiQuery({ name: 'orderCode', required: true, example: '1234567890' })
  async getPaymentStatus(
    @Query('orderCode') orderCode: string,
    @ActiveUser('userId') userId: number,
  ) {
    try {
      const data = await this.paymentRawTcpClient.send({
        type: 'GET_PAYMENT_STATUS',
        data: { orderCode, userId },
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @IsPublic()
  @Get('success')
  @ApiQuery({
    name: 'orderCode',
    required: true,
    description: 'Order code from PayOS for successful transaction.',
    example: '1754847847506',
  })
  @ApiQuery({
    name: 'status',
    required: true,
    description: 'Status of the transaction (e.g., PAID).',
    example: 'PAID',
  })
  async handlePayOSSuccessManual(
    @Query('orderCode') orderCode: string,
    @Query('status') status: string,
  ) {
    try {
      console.log(
        `Received manual PayOS success callback: orderCode=${orderCode}, status=${status}`,
      );

      if (!orderCode || !orderCode.trim()) {
        throw new HttpException(
          {
            success: false,
            message: 'Order code is required for successful payment callback.',
            error: 'Bad Request',
          },
          400,
        );
      }

      const data = await this.paymentRawTcpClient.send({
        type: 'HANDLE_PAYOS_SUCCESS_MANUAL',
        data: { orderCode },
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @IsPublic()
  @Get('failed')
  @ApiQuery({
    name: 'orderCode',
    required: true,
    description: 'Order code from PayOS for failed transaction.',
    example: '1754847847506',
  })
  @ApiQuery({
    name: 'status',
    required: true,
    description: 'Status of the transaction (e.g., FAILED).',
    example: 'FAILED',
  })
  async handlePayOSFailedManual(
    @Query('orderCode') orderCode: string,
    @Query('status') status: string,
  ) {
    try {
      console.log(
        `Received manual PayOS failed callback: orderCode=${orderCode}, status=${status}`,
      );

      if (!orderCode || !orderCode.trim()) {
        throw new HttpException(
          {
            success: false,
            message: 'Order code is required for failed payment callback.',
            error: 'Bad Request',
          },
          400,
        );
      }

      const data = await this.paymentRawTcpClient.send({
        type: 'HANDLE_PAYOS_FAILED_MANUAL',
        data: { orderCode },
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }
}
