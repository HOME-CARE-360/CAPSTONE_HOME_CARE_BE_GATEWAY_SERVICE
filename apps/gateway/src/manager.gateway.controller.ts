import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  GetListProviderQueryDTO,
  UpdateStatusProviderBodyDTO,
  UpdateStatusServiceBodyDTO,
} from 'libs/common/src/request-response-type/manager/managers.dto';
import { handleZodError } from 'libs/common/helpers';
import { MANAGER_SERVICE } from 'libs/common/src/constants/service-name.constant';
import { MessageResDTO } from 'libs/common/src/dtos/response.dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { lastValueFrom } from 'rxjs';
import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
import {
  CreateCategoryBodyDTO,
  UpdateCategoryQueryDTO,
} from 'libs/common/src/request-response-type/category/category.dto';
import {
  GetListWidthDrawQueryDTO,
  GetWidthDrawDetailParamsDTO,
  UpdateWithDrawalBodyDTO,
} from 'libs/common/src/request-response-type/with-draw/with-draw.dto';
import { ApiQuery } from '@nestjs/swagger';
import {
  CompanyType,
  ServiceStatus,
  VerificationStatus,
  WithdrawalStatus,
} from '@prisma/client';
import {
  OrderBy,
  SortBy,
  SortByWithDraw,
} from 'libs/common/src/constants/others.constant';
import {
  GetListReportQueryDTO,
  UpdateProviderReportDTO,
} from 'libs/common/src/request-response-type/report/report.dto';
import { AccessTokenPayload } from 'libs/common/src/types/jwt.type';
import { GetServicesForManagerQueryDTO } from 'libs/common/src/request-response-type/service/services.dto';
import { GetBookingReportQueryDTO } from 'libs/common/src/request-response-type/provider/provider/provider.dto';

@Controller('managers')
export class ManagerGatewayController {
  constructor(
    @Inject(MANAGER_SERVICE) private readonly managerClient: ClientProxy,
  ) {}
  @Patch('change-status-provider')
  @ZodSerializerDto(MessageResDTO)
  async changeStatusProvider(
    @Body() body: UpdateStatusProviderBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    try {
      return await lastValueFrom(
        this.managerClient.send(
          { cmd: 'change-status-provider' },
          { body, userId },
        ),
      );
    } catch (error) {
      console.log('o day ne');

      console.log(error);
      handleZodError(error);
    }
  }
  @Patch('change-status-service')
  @ZodSerializerDto(MessageResDTO)
  async changeStatusService(@Body() body: UpdateStatusServiceBodyDTO) {
    try {
      return await lastValueFrom(
        this.managerClient.send({ cmd: 'change-status-service' }, { body }),
      );
    } catch (error) {
      console.log('o day ne');

      console.log(error);
      handleZodError(error);
    }
  }

  @Post('create-category')
  @ZodSerializerDto(MessageResDTO)
  async createCategory(
    @Body() body: CreateCategoryBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    try {
      return await lastValueFrom(
        this.managerClient.send({ cmd: 'create-category' }, { body, userId }),
      );
    } catch (error) {
      handleZodError(error);
    }
  }
  @Patch('update-category/:categoryId')
  @ZodSerializerDto(MessageResDTO)
  async updateCategory(
    @Param() params: UpdateCategoryQueryDTO,
    @Body() body: CreateCategoryBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    try {
      return await lastValueFrom(
        this.managerClient.send(
          { cmd: 'update-category' },
          { body, userId, categoryId: params.categoryId },
        ),
      );
    } catch (error) {
      handleZodError(error);
    }
  }
  @Delete('delete-category/:categoryId')
  @ZodSerializerDto(MessageResDTO)
  async deleteCategory(
    @Param() params: UpdateCategoryQueryDTO,
    @ActiveUser('userId') userId: number,
  ) {
    try {
      return await lastValueFrom(
        this.managerClient.send(
          { cmd: 'delete-category' },
          { userId, categoryId: params.categoryId },
        ),
      );
    } catch (error) {
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
    name: 'providerName',
    required: false,
    type: String,
    description: 'Filter by provider name (optional)',
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
  async getListWithDraw(@Query() query: GetListWidthDrawQueryDTO) {
    try {
      return await lastValueFrom(
        this.managerClient.send({ cmd: 'get-list-withdraw' }, { ...query }),
      );
    } catch (error) {
      handleZodError(error);
    }
  }
  @Get('get-withdraw-detail/:id')
  @ZodSerializerDto(MessageResDTO)
  async getWithDrawDetail(@Param() param: GetWidthDrawDetailParamsDTO) {
    try {
      return await lastValueFrom(
        this.managerClient.send(
          { cmd: 'get-withdraw-detail' },
          { id: param.id },
        ),
      );
    } catch (error) {
      handleZodError(error);
    }
  }
  @Patch('update-withdraw')
  @ZodSerializerDto(MessageResDTO)
  async updateWithdraw(
    @Body() body: UpdateWithDrawalBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    try {
      return await lastValueFrom(
        this.managerClient.send({ cmd: 'update-withdraw' }, { body, userId }),
      );
    } catch (error) {
      handleZodError(error);
    }
  }
  @Get('get-report-detail/:id')
  @ZodSerializerDto(MessageResDTO)
  async getReportDetail(@Param() params: GetBookingReportQueryDTO) {
    try {
      return await lastValueFrom(
        this.managerClient.send(
          { cmd: 'get-report-detail' },
          { reportId: params.id },
        ),
      );
    } catch (error) {
      handleZodError(error);
    }
  }
  @Get('get-list-report')
  @ZodSerializerDto(MessageResDTO)
  async getListReport(@Query() query: GetListReportQueryDTO) {
    try {
      return await lastValueFrom(
        this.managerClient.send({ cmd: 'get-list-report' }, { query }),
      );
    } catch (error) {
      handleZodError(error);
    }
  }
  @Get('get-list-service')
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
    name: 'name',
    required: false,
    type: String,
    example: 'massage',
    description: 'Filter by service name (partial match)',
  })
  @ApiQuery({
    name: 'providerIds',
    required: false,
    isArray: true,
    type: Number,
    description:
      'Filter by provider IDs. Có thể truyền nhiều: ?providerIds=1&providerIds=2',
    example: [1, 2, 5],
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: Number,
    example: 12,
    description: 'Filter by category ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    isArray: true,
    enum: ServiceStatus,
    description:
      'Filter by service status. Một hoặc nhiều giá trị: ?status=PENDING&status=ACCEPTED or ?status=PENDING',
    example: [ServiceStatus.PENDING, ServiceStatus.ACCEPTED],
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    example: 100000,
    description: 'Minimum price (VND)',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    example: 500000,
    description: 'Maximum price (VND)',
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    enum: OrderBy,
    example: OrderBy.Desc,
    description: 'Sort order: asc | desc (default = desc)',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: SortBy,
    example: SortBy.CreatedAt,
    description:
      'Sort field: createdAt | price | discount (default = createdAt)',
  })
  @ZodSerializerDto(MessageResDTO)
  async getListService(@Query() query: GetServicesForManagerQueryDTO) {
    try {
      console.log(query);

      return await lastValueFrom(
        this.managerClient.send({ cmd: 'get-list-service' }, { ...query }),
      );
    } catch (error) {
      handleZodError(error);
    }
  }
  @Patch('update-report')
  @ZodSerializerDto(MessageResDTO)
  async updateReport(
    @Body() data: UpdateProviderReportDTO,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    try {
      return await lastValueFrom(
        this.managerClient.send(
          { cmd: 'update-report' },
          { data, userId: user.userId },
        ),
      );
    } catch (error) {
      handleZodError(error);
    }
  }
  @ApiQuery({
    name: 'verificationStatus',
    required: false,
    enum: VerificationStatus,
    description:
      'Filter by verification status (e.g., PENDING, VERIFIED, REJECTED)',
  })
  @ApiQuery({
    name: 'companyType',
    required: false,
    enum: CompanyType,
    description: 'Filter by company type',
  })
  @ApiQuery({
    name: 'taxId',
    required: false,
    type: String,
    description: 'Search by tax ID (partial match supported)',
  })
  @ApiQuery({
    name: 'licenseNo',
    required: false,
    type: String,
    description: 'Filter by license number',
  })
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
  @Get('get-list-provider')
  @ZodSerializerDto(MessageResDTO)
  async getListProvider(@Query() query: GetListProviderQueryDTO) {
    try {
      return await lastValueFrom(
        this.managerClient.send({ cmd: 'get-list-provider' }, { query }),
      );
    } catch (error) {
      handleZodError(error);
    }
  }
}
