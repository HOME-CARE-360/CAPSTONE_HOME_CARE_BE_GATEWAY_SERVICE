import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpException,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiQuery } from '@nestjs/swagger';
import { WithdrawalStatus } from '@prisma/client';
import { handlerErrorResponse, handleZodError } from 'libs/common/helpers';
import {
  OrderBy,
  SortByWithDraw,
} from 'libs/common/src/constants/others.constant';
import {
  PROVIDER_SERVICE,
  USER_SERVICE,
} from 'libs/common/src/constants/service-name.constant';
import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
import { IsPublic } from 'libs/common/src/decorator/auth.decorator';
import { MessageResDTO } from 'libs/common/src/dtos/response.dto';
import { ChangePasswordDTO } from 'libs/common/src/request-response-type/customer/customer.dto';
import { LinkBankAccountDTO } from 'libs/common/src/request-response-type/user/user.dto';
import {
  CreateWithdrawBodyDTO,
  GetListWidthDrawProviderQueryDTO,
  GetWidthDrawDetailParamsDTO,
} from 'libs/common/src/request-response-type/with-draw/with-draw.dto';
import { RawTcpClientService } from 'libs/common/src/tcp/raw-tcp-client.service';
import { AccessTokenPayload } from 'libs/common/src/types/jwt.type';
import { ZodSerializerDto } from 'nestjs-zod';
import { lastValueFrom } from 'rxjs';

@Controller('publics')
export class PublicGatewayController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userRawTcpClient: RawTcpClientService,
    @Inject(PROVIDER_SERVICE) private readonly providerClient: ClientProxy,
  ) {}

  @Get('get-staff-information/:staffId')
  async getStaffInformation(@Param('staffId') staffId: number) {
    try {
      const data = await this.userRawTcpClient.send({
        type: 'GET_STAFF',
        staffId: Number(staffId),
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Get('get-customer-information/:customerId')
  async changeStatusProvider(@Param('customerId') customerId: number) {
    try {
      const data = await this.userRawTcpClient.send({
        type: 'GET_CUSTOMER',
        customerId: Number(customerId),
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Get('get-service-provider-information/:providerId')
  async getServiceProviderInformation(@Param('providerId') providerId: number) {
    try {
      const data = await this.userRawTcpClient.send({
        type: 'GET_SERVICE_PROVIDER',
        providerId: Number(providerId),
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Patch('change-password')
  async changePassword(
    @Body() body: ChangePasswordDTO,
    @ActiveUser('userId') userId: number,
  ) {
    try {
      const data = await this.userRawTcpClient.send({
        type: 'CHANGE_PASSWORD',
        data: { ...body },
        userId,
      });
      console.log(data);
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Get('get-me')
  async getMe(@ActiveUser() user: AccessTokenPayload) {
    const keyName = ((user.customerId && 'customerId') ||
      (user.providerId && 'providerId') ||
      (user.staffId && 'staffId')) as string;
    const value = user.customerId || user.providerId || user.staffId;
    try {
      const data = await this.userRawTcpClient.send({
        type: 'GET_ME',
        [keyName]: value,
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
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number (default = 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Items per page (default = 10)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    isArray: true,
    enum: WithdrawalStatus,
    description: 'Filter by withdrawal status (multiple allowed)',
    example: ['PENDING', 'APPROVED'],
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    enum: OrderBy,
    description: 'Sort order: asc | desc',
    example: OrderBy.Desc,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: SortByWithDraw,
    description: 'Field to sort by: createdAt | amount | processedAt',
    example: SortByWithDraw.CreatedAt,
  })
  @Get('get-list-withdraw')
  @ZodSerializerDto(MessageResDTO)
  async getListWithDraw(
    @Query() query: GetListWidthDrawProviderQueryDTO,
    @ActiveUser('userId') userId: number,
  ) {
    try {
      return await lastValueFrom(
        this.providerClient.send(
          { cmd: 'get-list-withdraw' },
          { query, userId },
        ),
      );
    } catch (error) {
      handleZodError(error);
    }
  }
  @Get('get-withdraw-detail/:id')
  @ZodSerializerDto(MessageResDTO)
  async getWithDrawDetail(
    @Param() param: GetWidthDrawDetailParamsDTO,
    @ActiveUser('userId') userId: number,
  ) {
    try {
      return await lastValueFrom(
        this.providerClient.send(
          { cmd: 'get-withdraw-detail' },
          { id: param.id, userId },
        ),
      );
    } catch (error) {
      handleZodError(error);
    }
  }
  @Post('create-withdraw-request')
  @ZodSerializerDto(MessageResDTO)
  async createWidthDrawRequest(
    @Body() data: CreateWithdrawBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    try {
      return await lastValueFrom(
        this.providerClient.send(
          { cmd: 'create-withdraw-request' },
          { data, userId },
        ),
      );
    } catch (error) {
      handleZodError(error);
    }
  }
  @IsPublic()
@Get('top-discounted-services')
@ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
@ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
async getTopDiscountedServices(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
) {
  try {
    const p = page > 0 ? page : 1;
    const lim = limit > 0 ? limit : 10;
    const data = await this.userRawTcpClient.send({
      type: 'GET_TOP_DISCOUNTED_SERVICES',
      page: p,
      limit: lim,
    });
    handlerErrorResponse(data);
    return data;
  } catch (error) {
    if (error instanceof HttpException) throw error;
    handleZodError(error);
  }
}

@IsPublic()
@Get('top-providers-all-time')
@ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
@ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
async getTopProvidersAllTime(
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
) {
  try {
    const p = page > 0 ? page : 1;
    const lim = limit > 0 ? limit : 10;
    const data = await this.userRawTcpClient.send({
      type: 'GET_TOP_PROVIDERS_ALL_TIME',
      page: p,
      limit: lim,
    });
    handlerErrorResponse(data);
    return data;
  } catch (error) {
    if (error instanceof HttpException) throw error;
    handleZodError(error);
  }
}

@IsPublic()
@Get('reviews/:providerId')
@ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
@ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
@ApiQuery({ name: 'search', required: false, type: String, description: 'Search term for reviews' })
@ApiQuery({ name: 'rating', required: false, type: String, description: 'Filter by rating: single value ("5") or comma-separated ("4,5")' })
@ApiQuery({ name: 'sortBy', required: false, enum: ['createdAt', 'rating'], description: 'Sort field (default: createdAt)' })
@ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order (default: desc)' })
async getProviderReviews(
  @Param('providerId', ParseIntPipe) providerId: number,
  @Query('page') page?: string,
  @Query('limit') limit?: string,
  @Query('search') search?: string,
  @Query('rating') rating?: string,
  @Query('sortBy') sortBy?: 'createdAt' | 'rating',
  @Query('sortOrder') sortOrder?: 'asc' | 'desc',
) {
  try {
    // Parse and validate page
    const pg = page && Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
    
    // Parse and validate limit
    const lim = limit && Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;
    
    // Parse rating parameter
    let ratingParam: number | number[] | undefined;
    if (rating && rating.length > 0) {
      if (rating.includes(',')) {
        const arr = rating
          .split(',')
          .map((x) => Number(x.trim()))
          .filter((n) => Number.isFinite(n));
        ratingParam = arr.length ? arr : undefined;
      } else if (Number.isFinite(Number(rating))) {
        ratingParam = Number(rating);
      }
    }

    const data = await this.userRawTcpClient.send({
      type: 'GET_REVIEWS_BY_PROVIDER_ID',
      providerId,
      page: pg,
      limit: lim,
      ...(search && search.trim() ? { search: search.trim() } : {}),
      ...(ratingParam !== undefined ? { rating: ratingParam } : {}),
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