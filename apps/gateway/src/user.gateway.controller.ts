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
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { handlerErrorResponse, handleZodError } from 'libs/common/helpers';
import { USER_SERVICE } from 'libs/common/src/constants/service-name.constant';
import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
import { UpdateUserAndCustomerProfileDTO } from 'libs/common/src/request-response-type/customer/customer.dto';
import {
  createCustomerReportDTO,
  CustomerCompleteBookingDTO,
  LinkBankAccountDTO,
} from 'libs/common/src/request-response-type/user/user.dto';
import { RawTcpClientService } from 'libs/common/src/tcp/raw-tcp-client.service';
import { z } from 'zod';

export const PaginationZodSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  search: z.string().optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type PaginationDTO = z.infer<typeof PaginationZodSchema>;
export class UpdateProposalStatusDto {
  @ApiProperty({ enum: ['ACCEPT', 'REJECT'] })
  action: 'ACCEPT' | 'REJECT';
}

export const ReportQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  search: z.string().optional(),
  sortBy: z
    .enum(['createdAt', 'status', 'reason'])
    .optional()
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type ReportQueryDTO = z.infer<typeof ReportQuerySchema>;

@ApiTags('Users')
@ApiBearerAuth()
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

  @Patch('change-bank-account')
  async changeBankAccount(
    @Body() body: LinkBankAccountDTO,
    @ActiveUser('userId') userId: number,
  ) {
    try {
      const data = await this.userRawTcpClient.send({
        type: 'CHANGE_BANK_ACCOUNT',
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

  @Post('create-customer-report/:bookingId')
  async createCustomerReport(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @Body() body: createCustomerReportDTO,
    @ActiveUser('customerId') customerId: number,
  ) {
    try {
      const data = await this.userRawTcpClient.send({
        type: 'CREATE_CUSTOMER_REPORT',
        bookingId,
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
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['createdAt', 'status', 'reason'],
  })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  async getCustomerReports(
    @ActiveUser('customerId') customerId: number,
    @Query() rawQuery: any,
  ) {
    try {
      const query = ReportQuerySchema.parse(rawQuery);

      const data = await this.userRawTcpClient.send({
        type: 'GET_CUSTOMER_REPORTS',
        customerId,
        ...query, // includes page, limit, search, sortBy, sortOrder
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
  @ActiveUser('userId') userId: number,
) {
  try {
    const data = await this.userRawTcpClient.send({
      type: 'GET_PROPOSAL_BY_BOOKING_ID',
      bookingId,
      userId,
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
    @Body() body: UpdateProposalStatusDto,
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

  @Get('my-favorite-services')
  async getFavoriteServices(@ActiveUser('customerId') customerId: number) {
    try {
      const data = await this.userRawTcpClient.send({
        type: 'GET_CUSTOMER_FAVORITES',
        customerId,
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Patch('my-favorite-services/:serviceId')
  async toggleFavoriteService(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @ActiveUser('customerId') customerId: number,
  ) {
    try {
      const data = await this.userRawTcpClient.send({
        type: 'TOGGLE_FAVORITE_SERVICE',
        customerId,
        serviceId,
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

@Get('my-bookings')
@ApiQuery({ name: 'page', required: false, type: Number })
@ApiQuery({ name: 'limit', required: false, type: Number })
@ApiQuery({ name: 'search', required: false, type: String })
@ApiQuery({ name: 'sortBy', required: false, type: String })
@ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
async getMyBookings(
  @ActiveUser('customerId') customerId: number,
  @Query() rawQuery: any,
) {
  const result = PaginationZodSchema.safeParse(rawQuery);

  if (!result.success) {
    console.error('❌ Zod validation failed:', result.error.flatten());
    throw new HttpException(
      {
        message: 'Invalid query parameters',
        details: result.error.flatten().fieldErrors,
      },
      400,
    );
  }

  const query: PaginationDTO = result.data;

  try {
    const data = await this.userRawTcpClient.send({
      type: 'GET_BOOKING_BY_CUSTOMER',
      customerId,
      ...query, // includes: page, limit, search, sortBy, sortOrder
    });

    handlerErrorResponse(data);
    return data;
  } catch (error) {
    if (error instanceof HttpException) throw error;
    handleZodError(error);
  }
}

@Get('my-bookings/:bookingId')
async getMyBookingById(
  @Param('bookingId', ParseIntPipe) bookingId: number,
  @ActiveUser('customerId') customerId: number,
) {
    try {
      const data = await this.userRawTcpClient.send({
        type: 'GET_CUSTOMER_BOOKING_BY_ID',
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
}
