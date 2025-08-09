import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ZodSerializerDto } from 'nestjs-zod';

import { ApiQuery } from '@nestjs/swagger';
import { VerifiedProviderGuard } from 'libs/common/src/guards/verified-provider.guard';
import {
  CreateServicesBodyDTO,
  DeleteServicesParamDTO,
  GetServiceResDTO,
  GetServicesForProviderQueryDTO,
  GetServicesForProviderResDTO,
  UpdateServicesBodyDTO,
} from 'libs/common/src/request-response-type/service/services.dto';
import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
import { AccessTokenPayload } from 'libs/common/src/types/jwt.type';
import {
  OrderBy,
  SortBy,
  SortByServiceItem,
} from 'libs/common/src/constants/others.constant';
import { PROVIDER_SERVICE } from 'libs/common/src/constants/service-name.constant';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleZodError } from 'libs/common/helpers';
import {
  CreateServiceItemDTO,
  GetServiceItemParamsDTO,
  GetServiceItemsQueryDTO,
} from 'libs/common/src/request-response-type/provider/service-item/service-item.dto';

@Controller('manage-services')
@UseGuards(VerifiedProviderGuard)
export class ManageServicesGatewayController {
  constructor(
    @Inject(PROVIDER_SERVICE) private readonly providerClient: ClientProxy,
  ) {}
  @Post('/create-service')
  @ZodSerializerDto(CreateServicesBodyDTO)
  async createService(
    @Body() body: CreateServicesBodyDTO,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    console.log(user);

    try {
      return await lastValueFrom(
        this.providerClient.send(
          { cmd: 'create-service' },
          { body, userID: user.userId, providerId: user.providerId as number },
        ),
      );
    } catch (error) {
      console.log(error);

      handleZodError(error);
    }
  }
  @Post('/create-service-item')
  @ZodSerializerDto(CreateServicesBodyDTO)
  async createServiceItem(
    @Body() body: CreateServiceItemDTO,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    try {
      console.log(user);

      return await lastValueFrom(
        this.providerClient.send(
          { cmd: 'create-service-item' },
          { body, providerId: user.providerId as number },
        ),
      );
    } catch (error) {
      console.log(error);

      handleZodError(error);
    }
  }
  @Patch('/update-service-item')
  @ZodSerializerDto(CreateServicesBodyDTO)
  async updateServiceItem(
    @Body() body: CreateServiceItemDTO,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    try {
      return await lastValueFrom(
        this.providerClient.send(
          { cmd: 'update-service-item' },
          { body, providerId: user.providerId as number },
        ),
      );
    } catch (error) {
      console.log(error);

      handleZodError(error);
    }
  }

  @ApiQuery({
    name: 'isActive',
    required: true,
    type: Boolean,
    description: 'Filter by active status',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Filter by service item name (partial match)',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    description: 'Minimum price filter',
    example: 100,
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    description: 'Maximum price filter',
    example: 1000,
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    enum: OrderBy,
    description: `Sort order: Asc (ascending) or Desc (descending). Default Desc`,
    example: OrderBy.Desc,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: SortByServiceItem,
    description: `Sort field: CreatedAt or Price. Default CreatedAt`,
    example: SortByServiceItem.CreatedAt,
  })
  @Get('/get-service-item')
  async getServiceItem(
    @Query() query: GetServiceItemsQueryDTO,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    console.log('query ne');
    console.log(query);

    try {
      return await lastValueFrom(
        this.providerClient.send(
          { cmd: 'get-service-item' },
          { query, providerId: user.providerId as number },
        ),
      );
    } catch (error) {
      console.log(error);

      handleZodError(error);
    }
  }
  @Get('/delete-service-item/:serviceItemId')
  async deleteServiceItem(
    @Param() param: GetServiceItemParamsDTO,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    try {
      return await lastValueFrom(
        this.providerClient.send(
          { cmd: 'delete-service-item' },
          { param, providerId: user.providerId as number },
        ),
      );
    } catch (error) {
      console.log(error);

      handleZodError(error);
    }
  }
  @Get('/get-service-item-detail/:serviceItemId')
  async getServiceItemDetail(
    @Param() param: GetServiceItemParamsDTO,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    try {
      return await lastValueFrom(
        this.providerClient.send(
          { cmd: 'get-service-item-detail' },
          { param, user },
        ),
      );
    } catch (error) {
      console.log(error);

      handleZodError(error);
    }
  }

  @Get('/list-service')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Filter by service name (partial match)',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: Number,
    description: 'Category ID to filter by',
    example: 1,
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    description: 'Minimum base price',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    description: 'Maximum base price',
  })
  @ApiQuery({
    name: 'createdById',
    required: false,
    type: Number,
    description: 'Filter by creator user ID',
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    enum: OrderBy,
    description: 'Sort order: Asc or Desc',
    example: OrderBy.Desc,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: SortBy,
    description: 'Sort field: CreatedAt, Price, or Discount',
    example: SortBy.CreatedAt,
  })
  @ZodSerializerDto(GetServicesForProviderResDTO)
  async list(
    @Query() query: GetServicesForProviderQueryDTO,
    @ActiveUser('providerId') providerID: number,
  ) {
    try {
      return await lastValueFrom(
        this.providerClient.send(
          { cmd: '/list-service' },
          { query, providerID },
        ),
      );
    } catch (error) {
      console.log(error);

      handleZodError(error);
    }
  }

  @Patch('/delete-service/:serviceId')
  @ZodSerializerDto(UpdateServicesBodyDTO)
  async deleteService(
    @Param() serviceID: DeleteServicesParamDTO,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    try {
      return await lastValueFrom(
        this.providerClient.send(
          { cmd: '/delete-service' },
          { serviceID, user },
        ),
      );
    } catch (error) {
      console.log(error);

      handleZodError(error);
    }
  }
  @Get('/detail/:serviceId')
  @ZodSerializerDto(GetServiceResDTO)
  async getDetailService(
    @Param() serviceID: DeleteServicesParamDTO,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    try {
      return await lastValueFrom(
        this.providerClient.send({ cmd: '/detail' }, { serviceID, user }),
      );
    } catch (error) {
      console.log(error);

      handleZodError(error);
    }
  }
}
