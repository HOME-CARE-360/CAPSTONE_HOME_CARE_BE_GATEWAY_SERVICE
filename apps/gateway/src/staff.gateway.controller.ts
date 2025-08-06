import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
import {
  STAFF_SERVICE,
  USER_SERVICE,
} from 'libs/common/src/constants/service-name.constant';

import { handlerErrorResponse, handleZodError } from 'libs/common/helpers';

import { RawTcpClientService } from 'libs/common/src/tcp/raw-tcp-client.service';
import {
  CreateInspectionReportDTO,
  GetBookingBelongToStaffQueryDTO,
  GetRecentWorkLogsDTO,
  StaffGetReviewQueryDTO,
  UpdateInspectionReportDTO,
  UpdateUserAndStaffProfileDTO,
} from 'libs/common/src/request-response-type/staff/staff.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiParam,
  ApiProperty,
  ApiBody,
} from '@nestjs/swagger';

export class WorkLogImageDto {
  @ApiProperty({
    description: 'Danh sách URL hình ảnh minh chứng (tối đa 5)',
    type: [String],
    required: false,
    example: [
      'https://cdn.site.com/images/checkin1.jpg',
      'https://cdn.site.com/images/checkin2.jpg',
    ],
  })
  imageUrls?: string[];
}

@Controller('staffs')
@ApiTags('Staff Management')
@ApiBearerAuth()
export class StaffGatewayController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userRawTcpClient: RawTcpClientService,
    @Inject(STAFF_SERVICE)
    private readonly staffRawTcpClient: RawTcpClientService,
  ) {}

  @Patch('update-staff-information')
  async getUserInformation(
    @Body() body: UpdateUserAndStaffProfileDTO,
    @ActiveUser('staffId') staffId: number,
  ) {
    try {
      const data = await this.userRawTcpClient.send({
        type: 'UPDATE_STAFF',
        staffId,
        data: { ...body },
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Get('get-list-booking')
  @ApiOperation({ summary: 'Get bookings belonging to staff' })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter booking status',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'fromDate',
    required: false,
    type: String,
    description: 'Start date (ISO string)',
  })
  @ApiQuery({
    name: 'toDate',
    required: false,
    type: String,
    description: 'End date (ISO string)',
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    description: 'Search keyword',
  })
  async getListBooking(
    @Query() query: GetBookingBelongToStaffQueryDTO,
    @ActiveUser('staffId') staffId: number,
  ) {
    try {
      const data = await this.staffRawTcpClient.send({
        type: 'STAFF_GET_BOOKINGS',
        data: { staffId, ...query },
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Post('create-inspection-report')
  async createInspectionReport(
    @Body() body: CreateInspectionReportDTO,
    @ActiveUser('staffId') staffId: number,
  ) {
    try {
      const data = await this.staffRawTcpClient.send({
        type: 'STAFF_CREATE_INSPECTION_REPORT',
        data: { ...body, staffId },
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Get('get-booking-detail/:bookingId')
  @ApiParam({ name: 'bookingId', type: Number })
  async getBookingDetail(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @ActiveUser('staffId') staffId: number,
  ) {
    try {
      const data = await this.staffRawTcpClient.send({
        type: 'STAFF_GET_BOOKING_DETAIL',
        data: { bookingId, staffId },
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Get('staff-get-reviews')
  @ApiOperation({ summary: 'Get staff reviews' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'rating',
    required: false,
    type: Number,
    description: 'Filter by rating (1-5)',
  })
  @ApiQuery({
    name: 'fromDate',
    required: false,
    type: String,
    description: 'Start date (ISO string)',
  })
  @ApiQuery({
    name: 'toDate',
    required: false,
    type: String,
    description: 'End date (ISO string)',
  })
  async staffGetReview(
    @Query() query: StaffGetReviewQueryDTO,
    @ActiveUser('staffId') staffId: number,
  ) {
    try {
      const data = await this.staffRawTcpClient.send({
        type: 'STAFF_GET_REVIEWS',
        data: { ...query, staffId },
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Get('staff-get-inspection-detail/:inspectionId')
  @ApiParam({ name: 'inspectionId', type: Number })
  async staffGetInspectionDetail(
    @Param('inspectionId', ParseIntPipe) inspectionId: number,
    @ActiveUser('staffId') staffId: number,
  ) {
    try {
      const data = await this.staffRawTcpClient.send({
        type: 'STAFF_GET_INSPECTION_DETAIL',
        data: { inspectionId, staffId },
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Patch('update-inspection-report/:inspectionId')
  @ApiParam({ name: 'inspectionId', type: Number })
  async updateInspectionReport(
    @Body() body: UpdateInspectionReportDTO,
    @Param('inspectionId', ParseIntPipe) inspectionId: number,
    @ActiveUser('staffId') staffId: number,
  ) {
    try {
      const data = await this.staffRawTcpClient.send({
        type: 'UPDATE_INSPECTION_REPORT',
        data: { dataInspection: { ...body }, inspectionId, staffId },
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

    @Post('staff-checkin/:bookingId')
  @ApiParam({ name: 'bookingId', type: Number })
  @ApiBody({ type: WorkLogImageDto })
  async staffCreateWorkLogs(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @ActiveUser('staffId') staffId: number,
    @Body() body: WorkLogImageDto,
  ) {
    try {
      const data = await this.staffRawTcpClient.send({
        type: 'STAFF_CREATE_WORK_LOG',
        data: {
          bookingId,
          staffId,
          imageUrls: body.imageUrls ?? [],
        },
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  // ✅ Staff Check-out
  @Patch('staff-checkout/:bookingId')
  @ApiParam({ name: 'bookingId', type: Number })
  @ApiBody({ type: WorkLogImageDto })
  async staffCheckOut(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @Body() body: WorkLogImageDto,
  ) {
    try {
      const data = await this.staffRawTcpClient.send({
        type: 'STAFF_CHECK_OUT',
        data: {
          bookingId,
          imageUrls: body.imageUrls ?? [],
        },
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }
  @Get('staff-get-performance')
  async staffGetPerformance(@ActiveUser('staffId') staffId: number) {
    try {
      const data = await this.staffRawTcpClient.send({
        type: 'STAFF_GET_PERFORMANCE',
        data: { staffId },
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Get('staff-get-review-summary')
  async staffGetReviewSummary(@ActiveUser('staffId') staffId: number) {
    try {
      const data = await this.staffRawTcpClient.send({
        type: 'STAFF_GET_REVIEW_SUMMARY',
        data: { staffId },
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Get('staff-get-reports')
  async staffGetInspectionReports(@ActiveUser('staffId') staffId: number) {
    try {
      const data = await this.staffRawTcpClient.send({
        type: 'STAFF_GET_INSPECTION_REPORTS',
        data: { staffId },
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Get('get-recent-work-logs')
  async staffGetWorkLogs(
    @Query() query: GetRecentWorkLogsDTO,
    @ActiveUser('staffId') staffId: number,
  ) {
    try {
      const data = await this.staffRawTcpClient.send({
        type: 'STAFF_GET_WORK_LOGS',
        data: { ...query, staffId },
      });
      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Get('staff-get-monthly-stats')
  @ApiQuery({
    name: 'month',
    required: false,
    type: Number,
    description: 'Month number (1–12)',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    type: Number,
    description: '4-digit year (e.g., 2025)',
  })
  async staffGetMonthlyStats(
    @ActiveUser('staffId') staffId: number,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    try {
      const data = await this.staffRawTcpClient.send({
        type: 'STAFF_GET_MONTHLY_STATS',
        data: { staffId, month, year },
      });

      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }

  @Get('staff-get-proposal/:bookingId')
  @ApiOperation({ summary: 'Get full proposal' })
  @ApiParam({ name: 'bookingId', type: Number })
  async staffGetProposal(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @ActiveUser('staffId') staffId: number,
  ) {
    try {
      const data = await this.staffRawTcpClient.send({
        type: 'STAFF_GET_PROPOSAL',
        data: { staffId, bookingId },
      });

      handlerErrorResponse(data);
      return data;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      handleZodError(error);
    }
  }
}
