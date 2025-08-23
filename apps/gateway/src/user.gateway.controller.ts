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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { handlerErrorResponse, handleZodError } from 'libs/common/helpers';
import { USER_SERVICE } from 'libs/common/src/constants/service-name.constant';
import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
import { IsPublic } from 'libs/common/src/decorator/auth.decorator';
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

export const MaintenanceSuggestionOptionsSchema = z.object({
  type: z.string().optional().default('byAssetType'),
  limit: z.coerce.number().int().positive().max(50).optional(),
  priorityFilter: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
  dueSoon: z.coerce.boolean().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
});

const CreateAssetBase = z.object({
  categoryId: z.coerce.number().int().positive(),
  brand: z.string().min(1).max(100).optional(),
  model: z.string().min(1).max(100).optional(),
  serial: z.string().max(255).optional(),
  nickname: z.string().min(1).max(255).optional(),
  purchaseDate: z.coerce.date().optional(),
});


/** Optional: shared refinement to keep dates consistent */
const datesNotBefore = <
  T extends { purchaseDate?: Date; lastMaintenanceDate?: Date },
>(
  schema: z.ZodType<T>,
) =>
  schema.refine(
    (v) =>
      !v.purchaseDate ||
      !v.lastMaintenanceDate ||
      v.lastMaintenanceDate >= v.purchaseDate,
    {
      path: ['lastMaintenanceDate'],
      message: 'lastMaintenanceDate must be on/after purchaseDate',
    },
  );

/** 2) Create schema (if you want the refinement on create) */
export const CreateAssetSchema = datesNotBefore(CreateAssetBase);

/** 3) Update schema: make everything optional, ensure categoryId rule, reapply refinement */
export const UpdateAssetSchema = datesNotBefore(
  CreateAssetBase.partial().merge(
    z.object({
      categoryId: z.coerce.number().int().positive().optional(),
    }),
  ),
);

/** (Optional) Guard: require at least one field for update */
export const NonEmptyUpdateAssetSchema = UpdateAssetSchema.refine(
  (v) => Object.keys(v).length > 0,
  { message: 'At least one field must be provided for update' },
);

export const UpdateMaintenanceStatsSchema = z.object({
  lastDate: z.string().datetime(),
  totalCount: z.coerce.number().int().min(0),
});

export const AssetIdsSchema = z.object({
  assetIds: z.array(z.coerce.number().int().positive()).min(1),
});

export type MaintenanceSuggestionOptionsDTO = z.infer<
  typeof MaintenanceSuggestionOptionsSchema
>;
export type CreateAssetDTO = z.infer<typeof CreateAssetSchema>;
export type UpdateAssetDTO = z.infer<typeof UpdateAssetSchema>;
export type UpdateMaintenanceStatsDTO = z.infer<
  typeof UpdateMaintenanceStatsSchema
>;
export type AssetIdsDTO = z.infer<typeof AssetIdsSchema>;

// DTO classes for Swagger documentation - Updated field names
// class MaintenanceSuggestionOptionsSwaggerDTO {
//   @ApiProperty({ required: false, default: 'byAssetType' })
//   type?: string;

//   @ApiProperty({ required: false, minimum: 1, maximum: 50 })
//   limit?: number;

//   @ApiProperty({ required: false, enum: ['HIGH', 'MEDIUM', 'LOW'] })
//   priorityFilter?: 'HIGH' | 'MEDIUM' | 'LOW';

//   @ApiProperty({ required: false })
//   dueSoon?: boolean;

//   @ApiProperty({ required: false, minimum: 1 })
//   categoryId?: number;
// }

export class CreateAssetSwaggerDTO {
  @ApiProperty({
    description: 'Category ID (REQUIRED - must exist in database)',
    minimum: 1,
  })
  categoryId: number;

  @ApiProperty({ required: false, description: 'Asset brand', maxLength: 100 })
  brand?: string;

  @ApiProperty({ required: false, description: 'Asset model', maxLength: 100 })
  model?: string;

  @ApiProperty({
    required: false,
    description: 'Serial number',
    maxLength: 255,
  })
  serial?: string;

  @ApiProperty({
    required: false,
    description: 'Asset nickname/display name',
    maxLength: 255,
  })
  nickname?: string;

   @ApiProperty({
    required: false,
    description: 'Purchase date (ISO string)',
    example: '2025-08-21T00:00:00.000Z',
  })
  purchaseDate?: string;
}

class UpdateAssetSwaggerDTO {
  @ApiProperty({ required: false, description: 'Category ID', minimum: 1 })
  categoryId?: number;

  @ApiProperty({ required: false, description: 'Asset brand', maxLength: 100 })
  brand?: string;

  @ApiProperty({ required: false, description: 'Asset model', maxLength: 100 })
  model?: string;

  @ApiProperty({
    required: false,
    description: 'Serial number',
    maxLength: 255,
  })
  serial?: string;

  @ApiProperty({
    required: false,
    description: 'Asset nickname/display name',
    maxLength: 255,
  })
  nickname?: string;

  @ApiProperty({
    required: false,
    description: 'Asset description',
    maxLength: 1000,
  })
  description?: string;

  @ApiProperty({ required: false, description: 'Purchase date (ISO string)' })
  purchaseDate?: string;

  @ApiProperty({
    required: false,
    description: 'Last maintenance date (ISO string)',
  })
  lastMaintenanceDate?: string;

  @ApiProperty({
    required: false,
    description: 'Total maintenance count',
    minimum: 0,
  })
  totalMaintenanceCount?: number;
}

class UpdateMaintenanceStatsSwaggerDTO {
  @ApiProperty({ description: 'Last maintenance date (ISO string)' })
  lastDate: string;

  @ApiProperty({ description: 'Total maintenance count', minimum: 0 })
  totalCount: number;
}

class AssetIdsSwaggerDTO {
  @ApiProperty({
    description: 'Array of asset IDs',
    type: [Number],
    minItems: 1
  })
  assetIds: number[];
}
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserGatewayController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userRawTcpClient: RawTcpClientService,
  ) { }

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
  @Post('create-review/:bookingId')
  @ApiOperation({ summary: 'Create a new review for a booking' })
  @ApiParam({
    name: 'bookingId',
    type: Number,
    description: 'ID of the booking to review',
  })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input or rating.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized if customerId is missing.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createReview(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @ActiveUser('customerId') customerId: number,
    @Body() body: CreateReviewDto,
  ) {
    try {
      const { rating, comment } = body;

      const data = await this.userRawTcpClient.send({
        type: 'CREATE_REVIEW',
        customerId,
        bookingId,
        rating,
        comment,
      });

      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
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
        data,
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
  @ApiParam({
    name: 'reviewId',
    type: Number,
    required: true,
    description: 'Review ID',
  })
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

  @Get('suggestions')
  @ApiOperation({ summary: 'Get maintenance suggestions for customer' })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'priorityFilter',
    required: false,
    enum: ['HIGH', 'MEDIUM', 'LOW'],
  })
  @ApiQuery({ name: 'dueSoon', required: false, type: Boolean })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  async getMaintenanceSuggestions(
    @ActiveUser('customerId') customerId: number,
    @Query() rawQuery: any,
  ) {
    try {
      const options = MaintenanceSuggestionOptionsSchema.parse(rawQuery);


      const data = await this.userRawTcpClient.send({
        type: 'SUGGEST_FOR_CUSTOMER',
        customerId,
        options,
      });

      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Post('sync-stats')
  @ApiOperation({ summary: 'Sync maintenance stats for customer assets' })
  @ApiQuery({
    name: 'assetId',
    required: false,
    type: Number,
    description: 'Optional specific asset ID to sync',
  })
  async syncMaintenanceStats(
    @ActiveUser('customerId') customerId: number,
    @Query('assetId') assetId?: number,
  ) {
    try {
      const data = await this.userRawTcpClient.send({
        type: 'SYNC_ASSET_MAINTENANCE_STATS',
        customerId,
        ...(assetId ? { assetId: Number(assetId) } : {}),
      });

      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

@Post(':customerId/assets') // route có param customerId
@ApiOperation({ summary: 'Create a new customer asset' })
@ApiParam({
  name: 'customerId',
  type: Number,
  required: true,
  description: 'Customer ID (must exist in database)',
})
@ApiBody({ type: CreateAssetSwaggerDTO })
@ApiResponse({ status: 201, description: 'Customer asset created successfully' })
@ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
async createAsset(
  @Param('customerId', ParseIntPipe) customerId: number,
  @Body() body: unknown,
) {
  try {
    const validated: CreateAssetDTO = CreateAssetSchema.parse(body);
    console.log('Validated asset data:', validated);
    console.log('Customer ID:', customerId);
    const data = await this.userRawTcpClient.send({
      type: 'CREATE_CUSTOMER_ASSET',
      data: {
        customerId,
        ...validated,
      },
    });

    handlerErrorResponse(data);
    return data;
  } catch (error) {
    if (error instanceof HttpException) throw error;
    handleZodError(error);
  }
}
  
  @Delete('assets/:assetId')
  @ApiOperation({ summary: 'Remove customer asset' })
  @ApiParam({ name: 'assetId', type: Number, required: true })
  async removeAsset(
    @ActiveUser('customerId') customerId: number,
    @Param('assetId', ParseIntPipe) assetId: number,
  ) {
    try {
      const data = await this.userRawTcpClient.send({
        type: 'REMOVE_CUSTOMER_ASSET',
        customerId,
        assetId,
      });

      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Get(':customerId/assets')
  @ApiOperation({ summary: 'Get all assets of a customer' })
  @ApiParam({ name: 'customerId', type: Number, required: true, description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Assets retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAssets(@Param('customerId', ParseIntPipe) customerId: number) {
    try {
      const data = await this.userRawTcpClient.send({
        type: 'GET_CUSTOMER_ASSETS',
        customerId,
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }
  @Patch('assets/:assetId/stats')
  @ApiOperation({ summary: 'Update asset maintenance statistics' })
  @ApiParam({ name: 'assetId', type: Number, required: true })
  async updateAssetMaintenanceStats(
    @Param('assetId', ParseIntPipe) assetId: number,
    @Body() body: UpdateMaintenanceStatsSwaggerDTO,
  ) {
    try {
      const validatedData = UpdateMaintenanceStatsSchema.parse(body);

      const data = await this.userRawTcpClient.send({
        type: 'UPDATE_ASSET_MAINTENANCE_STATS',
        assetId,
        lastDate: new Date(validatedData.lastDate).toISOString(),
        totalCount: validatedData.totalCount,
      });

      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @IsPublic()
  @Get('services/:serviceId/reviews')
  @ApiOperation({ summary: 'Get reviews of a service' })
  @ApiParam({ name: 'serviceId', type: Number, required: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'rating',
    required: false,
    type: Number,
    isArray: true,
    description: 'rating=4 or rating=4,5 or rating=4&rating=5',
  })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['createdAt', 'rating'] })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Service reviews fetched successfully' })
  async getServiceReviews(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('rating') rating?: string | string[],
    @Query('sortBy') sortBy?: 'createdAt' | 'rating',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    try {
      const parsedRating = this.parseRatingQuery(rating);

      const data = await this.userRawTcpClient.send({
        type: 'GET_REVIEWS_BY_SERVICE_ID',
        serviceId,
        page: Number(page ?? 1),
        limit: Number(limit ?? 10),
        search,
        rating: parsedRating,
        sortBy: sortBy ?? 'createdAt',
        sortOrder: sortOrder ?? 'desc',
      });

      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }
}
