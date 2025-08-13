import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
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

const GetTransactionsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().trim().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

type GetTransactionsQueryDto = z.infer<typeof GetTransactionsQuerySchema>;

export type ReportQueryDTO = z.infer<typeof ReportQuerySchema>;
class CreateReviewDto {
  @ApiProperty({ description: 'Rating from 1 to 5', minimum: 1, maximum: 5 })
  rating: number;

  @ApiProperty({
    description: 'Optional comment for the review',
    required: false,
  })
  comment?: string;
}
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

    if (!['ACCEPTED', 'REJECT'].includes(action)) {
      throw new HttpException(
        "Invalid action. Must be either 'ACCEPTED' or 'REJECT'",
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

  @Patch('cancel-service-request/:serviceRequestId')
  async cancelServiceRequest(
    @Param('serviceRequestId', ParseIntPipe) serviceRequestId: number,
    @ActiveUser('customerId') customerId: number,
  ) {
    try {
      const data = await this.userRawTcpClient.send({
        type: 'CANCEL_SERVICE_REQUEST',
        customerId,
        serviceRequestId,
      });

      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }
  @Post('create-review/:bookingId')
  async createReview(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @ActiveUser('customerId') customerId: number,
    @Body() body: CreateReviewDto,
  ) {
    try {
      const { rating, comment } = body;

      if (rating < 1 || rating > 5) {
        throw new HttpException('Rating must be between 1 and 5', 400);
      }

      const data = await this.userRawTcpClient.send({
        type: 'CREATE_REVIEW',
        payload: {
          customerId,
          bookingId,
          rating,
          comment,
        },
      });

      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Get('transactions')
  async getTransactions(
    @ActiveUser('userId') userId: number,
    @Query() rawQuery: Record<string, any>,
  ) {
    try {
      const query: GetTransactionsQueryDto =
        GetTransactionsQuerySchema.parse(rawQuery);

      const data = await this.userRawTcpClient.send({
        type: 'GET_TRANSACTIONS_BY_USERID',
        userId,
        ...query,
      });

      handlerErrorResponse(data);

      return {
        data
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  private parseRatingQuery(
    rating: string | string[] | undefined,
  ): number | number[] | undefined {
    if (typeof rating === 'undefined') return undefined;

    const toNum = (v: string) => Number(v);
    if (typeof rating === 'string') {
      if (rating.includes(',')) {
        const arr = rating
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean)
          .map(toNum)
          .filter((n) => !Number.isNaN(n));
        return arr.length === 1 ? arr[0] : arr;
      }
      const n = Number(rating);
      return Number.isNaN(n) ? undefined : n;
    }

    // rating=3&rating=5 -> ["3","5"]
    const arr = rating
      .map((x) => x.trim())
      .filter(Boolean)
      .map(toNum)
      .filter((n) => !Number.isNaN(n));
    return arr.length === 1 ? arr[0] : arr;
  }

@Get('reviews')
@ApiQuery({ name: 'page', required: false, type: Number })
@ApiQuery({ name: 'limit', required: false, type: Number })
@ApiQuery({ name: 'search', required: false, type: String })
@ApiQuery({ name: 'rating', required: false, type: Number, isArray: true })
@ApiQuery({ name: 'sortBy', required: false, enum: ['createdAt', 'rating'] })
@ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
async getMyReviews(
  @ActiveUser('customerId') customerId: number,
  @Query('page') page?: number,
  @Query('limit') limit?: number,
  @Query('search') search?: string,
  @Query('rating') rating?: string | string[],
  @Query('sortBy') sortBy?: 'createdAt' | 'rating',
  @Query('sortOrder') sortOrder?: 'asc' | 'desc',
) {
  try {
    const parsedRating = this.parseRatingQuery(rating);

    const payload = {
      type: 'GET_REVIEWS_BY_CUSTOMERID',
      customerId: Number(customerId),
      page: Number(page ?? 1),
      limit: Number(limit ?? 10),
      search,
      rating: parsedRating,
      sortBy: sortBy ?? 'createdAt',
      sortOrder: sortOrder ?? 'desc',
    };

    const data = await this.userRawTcpClient.send(payload);
    handlerErrorResponse(data);

    return {
      success: true,
      message: 'Customer reviews retrieved successfully',
      data,
    };
  } catch (error) {
    if (error instanceof HttpException) throw error;
    handleZodError(error);
  }
}

  @Delete('reviews/:reviewId')
  @ApiOperation({ summary: 'Delete my review' })
  @ApiParam({ name: 'reviewId', type: Number, required: true, description: 'Review ID' })
  async deleteMyReview(
    @ActiveUser('customerId') customerId: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
  ) {
    try {
      const payload = {
        type: 'DELETE_REVIEW',
        customerId: Number(customerId),
        reviewId: Number(reviewId),
      };

      const data = await this.userRawTcpClient.send(payload);
      handlerErrorResponse(data);

      return {
        success: true,
        message: 'Review deleted successfully',
        data,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }
}