import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { handlerErrorResponse, handleZodError } from 'libs/common/helpers';
import { USER_SERVICE } from 'libs/common/src/constants/service-name.constant';
import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
import {
  UpdateUserAndCustomerProfileDTO,
} from 'libs/common/src/request-response-type/customer/customer.dto';
import {
  createCustomerReportDTO,
  CustomerCompleteBookingDTO,
  LinkBankAccountDTO,
} from 'libs/common/src/request-response-type/user/user.dto';
import { RawTcpClientService } from 'libs/common/src/tcp/raw-tcp-client.service';

@Controller('users')
export class UserGatewayController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userRawTcpClient: RawTcpClientService,
  ) {}

  @Patch('update-customer-information')
  async updateCustomer(
    @Body() body: UpdateUserAndCustomerProfileDTO,
    @ActiveUser('customerId') customerId: number,
  ) {
    try {
      const data = await this.userRawTcpClient.send({
        type: 'UPDATE_CUSTOMER',
        customerId,
        data: { ...body },
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Patch('link-bank-account')
  async linkBankAccount(
    @Body() body: LinkBankAccountDTO,
    @ActiveUser('userId') userId: number,
  ) {
    try {
      const data = await this.userRawTcpClient.send({
        type: 'LINK_BANK_ACCOUNT',
        userId,
        ...body,
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Patch('complete-booking')
  async customerCompleteBooking(
    @Body() body: CustomerCompleteBookingDTO,
    @ActiveUser('userId') currentUserId: number,
  ) {
    try {
      const data = await this.userRawTcpClient.send({
        type: 'CUSTOMER_COMPLETE_BOOKING',
        bookingId: body.bookingId,
        currentUserId,
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Post('create-customer-report')
  async createCustomerReport(
    @Body() body: createCustomerReportDTO,
    @ActiveUser('customerId') customerId: number,
  ) {
    try {
      const data = await this.userRawTcpClient.send({
        type: 'CREATE_CUSTOMER_REPORT',
        bookingId: body.bookingId,
        customerId,
        reason: body.reason,
        description: body.description,
        imageUrls: body.imageUrls,
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Get('my-reports')
  async getCustomerReports(@ActiveUser('customerId') customerId: number) {
    try {
      const data = await this.userRawTcpClient.send({
        type: 'GET_CUSTOMER_REPORTS',
        customerId,
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Get('my-proposal/:bookingId')
  async getProposalByBookingId(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @ActiveUser('customerId') customerId: number,
  ) {
    try {
      const data = await this.userRawTcpClient.send({
        type: 'GET_PROPOSAL_BY_CUSTOMER',
        bookingId,
        customerId,
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

   @Patch('proposal/:bookingId')
  async updateProposalStatus(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @ActiveUser('customerId') customerId: number,
    @Body() body: { action: 'ACCEPT' | 'REJECT' },
  ) {
    const { action } = body;

    if (!['ACCEPT', 'REJECT'].includes(action)) {
      throw new HttpException(
        "Invalid action. Must be either 'ACCEPT' or 'REJECT'",
        400,
      );
    }

    try {
      const data = await this.userRawTcpClient.send({
        type: 'UPDATE_PROPOSAL_STATUS',
        bookingId,
        customerId,
        action,
      });

      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Unexpected error occurred', 500);
    }
  }
}