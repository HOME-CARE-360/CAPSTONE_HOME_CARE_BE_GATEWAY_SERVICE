import { ApiQuery } from '@nestjs/swagger';
import { VerifiedProviderGuard } from 'libs/common/src/guards/verified-provider.guard';
import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
import { OrderBy, SortBy, SortByStaff } from 'libs/common/src/constants/others.constant';
import { PROVIDER_SERVICE } from 'libs/common/src/constants/service-name.constant';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleZodError } from 'libs/common/helpers';
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
import {
  CreateProposedServiceDTO,
  EditProposedServiceDTO,
} from 'libs/common/src/request-response-type/proposed/proposed.dto';
import {
  AssignStaffToBookingBodyDTO,
  CancelServiceRequestBodyDTO,
  GetServicesRequestQueryDTO,
} from 'libs/common/src/request-response-type/bookings/booking.dto';
import { CreateBookingReportBodyDTO, GetBookingReportsQueryDTO, UpdateBookingReportBodyDTO } from 'libs/common/src/request-response-type/provider/provider/provider.dto';
import { ReportStatus } from '@prisma/client';

@Controller('manage-bookings')
@UseGuards(VerifiedProviderGuard)
export class ManageBookingsGatewayController {
  constructor(
    @Inject(PROVIDER_SERVICE) private readonly providerClient: ClientProxy,
  ) { }
  @Get('/list-service-request')
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
    name: 'location',
    required: false,
    type: String,
    description: 'Filter by location name (partial match)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter by status (partial match)',
  })
  @ApiQuery({
    name: 'categories',
    required: false,
    isArray: true,
    type: Number,
    description: 'List of category IDs to filter by',
    example: [4, 7],
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
  async list(
    @Query() data: GetServicesRequestQueryDTO,
    @ActiveUser('providerId') providerID: number,
  ) {
    try {
      return await lastValueFrom(
        this.providerClient.send(
          { cmd: 'get-request-service' },
          { data, providerID },
        ),
      );
    } catch (error) {
      console.log(error);

      handleZodError(error);
    }
  }
  @Get('/service-request-detail/:serviceRequestId')
  async detail(
    @Param() data: CancelServiceRequestBodyDTO,
    @ActiveUser('providerId') providerID: number,
  ) {
    try {
      return await lastValueFrom(
        this.providerClient.send(
          { cmd: 'get-request-service-detail' },
          { data, providerID },
        ),
      );
    } catch (error) {
      console.log(error);

      handleZodError(error);
    }
  }

  @Post('report-booking')
  async cancelBooking(
    @Body() body: CreateBookingReportBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    try {
      return await lastValueFrom(
        this.providerClient.send(
          { cmd: 'report-booking' },
          { body, userId },
        ),
      );
    } catch (error) {
      console.log(error);

      handleZodError(error);
    }
  }
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
    name: 'status',
    required: false,
    enum: ReportStatus,
    description: 'Filter by status (partial match)',
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
    enum: SortByStaff,
    description: 'Sort field: CreatedAt',
    example: SortByStaff.CreatedAt,
  })
  @Get("get-list-report")
  async getListReport(@Query() query: GetBookingReportsQueryDTO, @ActiveUser('userId') userId: number) {
    console.log(query);

    try {
      return await lastValueFrom(
        this.providerClient.send(
          { cmd: 'get-list-report' },
          { query, userId },
        ),
      );
    } catch (error) {
      console.log(error);

      handleZodError(error);
    }
  }

  @Post('update-report-booking')
  async updateCancelBooking(
    @Body() body: UpdateBookingReportBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    try {
      return await lastValueFrom(
        this.providerClient.send(
          { cmd: 'update-report-booking' },
          { body, userId },
        ),
      );
    } catch (error) {
      console.log(error);

      handleZodError(error);
    }
  }
  @Post('assign-staff-to-booking')
  async assignStaffToBooking(
    @Body() data: AssignStaffToBookingBodyDTO,
    @ActiveUser('providerId') providerID: number,
  ) {
    try {
      return await lastValueFrom(
        this.providerClient.send(
          { cmd: 'assign-staff-to-booking' },
          { data, providerID },
        ),
      );
    } catch (error) {
      console.log(error);

      handleZodError(error);
    }
  }
  @Post('create-proposed')
  async createProposed(
    @Body() body: CreateProposedServiceDTO,
    @ActiveUser('providerId') providerID: number,
  ) {
    try {
      return await lastValueFrom(
        this.providerClient.send(
          { cmd: 'create-proposed' },
          { data: { ...body }, providerID },
        ),
      );
    } catch (error) {
      console.log(error);

      handleZodError(error);
    }
  }
  @Patch('edit-proposed')
  async editProposed(
    @Body() body: EditProposedServiceDTO,
    @ActiveUser('providerId') providerID: number,
  ) {
    try {
      return await lastValueFrom(
        this.providerClient.send(
          { cmd: 'edit-proposed' },
          { data: { ...body }, providerID },
        ),
      );
    } catch (error) {
      console.log(error);

      handleZodError(error);
    }
  }
  @Patch('cancel-service-request')
  async createServiceRequest(
    @Body() body: CancelServiceRequestBodyDTO,
    @ActiveUser('providerId') providerID: number,
  ) {
    try {
      return await lastValueFrom(
        this.providerClient.send(
          { cmd: 'cancel-service-request' },
          { data: { ...body }, providerID },
        ),
      );
    } catch (error) {
      console.log(error);

      handleZodError(error);
    }
  }
}
