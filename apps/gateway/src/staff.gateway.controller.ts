import { Body, Controller, Get, HttpException, Inject, Param, Patch, Post, Query, } from '@nestjs/common';
import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
import { STAFF_SERVICE, USER_SERVICE } from 'libs/common/src/constants/service-name.constant';

import { handlerErrorResponse, handleZodError } from 'libs/common/helpers';

import { RawTcpClientService } from 'libs/common/src/tcp/raw-tcp-client.service';
import { CreateInspectionReportDTO, GetBookingBelongToStaffQueryDTO, GetBookingDetailDTO, GetInspectionDetailDTO, GetRecentWorkLogsDTO, StaffGetReviewQueryDTO, UpdateInspectionReportDTO, UpdateUserAndStaffProfileDTO } from 'libs/common/src/request-response-type/staff/staff.dto';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
@Controller('staffs')
export class StaffGatewayController {
    constructor(@Inject(USER_SERVICE) private readonly userRawTcpClient: RawTcpClientService, @Inject(STAFF_SERVICE) private readonly staffRawTcpClient: RawTcpClientService) { }

    @Patch('update-staff-information')
    async getUserInformation(@Body() body: UpdateUserAndStaffProfileDTO, @ActiveUser("staffId") staffId: number) {
        try {
            const data = await this.userRawTcpClient.send({ type: 'UPDATE_STAFF', staffId, data: { ...body } })
            handlerErrorResponse(data)
            return data
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error)
        }
    }
    @Get('get-list-booking')
    @ApiOperation({ summary: 'Get bookings belonging to staff' })
    @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter booking status' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
    @ApiQuery({ name: 'fromDate', required: false, type: String, description: 'Start date (ISO string)' })
    @ApiQuery({ name: 'toDate', required: false, type: String, description: 'End date (ISO string)' })
    @ApiQuery({ name: 'keyword', required: false, type: String, description: 'Search keyword' })
    @Get("get-list-booking")
    async getListBooking(@Query() query: GetBookingBelongToStaffQueryDTO, @ActiveUser("staffId") staffId: number) {
        try {
            const data = await this.staffRawTcpClient.send({
                type: 'STAFF_GET_BOOKINGS', data: {
                    staffId, ...query
                }
            })
            handlerErrorResponse(data)
            return data
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error)
        }
    }
    @Post("create-inspection-report")
    async createInspectionReport(@Body() body: CreateInspectionReportDTO, @ActiveUser("staffId") staffId: number) {
        try {
            const data = await this.staffRawTcpClient.send({
                type: "STAFF_CREATE_INSPECTION_REPORT", data: {
                    ...body, staffId
                }
            })
            handlerErrorResponse(data)
            return data
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error)
        }
    }
    @Get("get-booking-detail/:bookingId")
    async getBookingDetail(@Param() params: GetBookingDetailDTO, @ActiveUser("staffId") staffId: number) {
        try {
            const data = await this.staffRawTcpClient.send({
                type: "STAFF_CREATE_INSPECTION_REPORT", data: {
                    ...params, staffId
                }
            })
            handlerErrorResponse(data)
            return data
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error)
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
                data: {
                    ...query,
                    staffId,
                },
            });
            handlerErrorResponse(data)
            return data
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error)
        }
    }
    @Get("staff-get-inspection-reports")
    async staffGetInspectionReports(
        @ActiveUser('staffId') staffId: number,
    ) {
        try {
            const data = await this.staffRawTcpClient.send({
                type: 'STAFF_GET_INSPECTION_REPORTS',
                data: {
                    staffId,
                },
            });
            handlerErrorResponse(data)
            return data
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error)
        }
    }
    @Get("staff-get-inspection-detail/:inspectionId")
    async staffGetInspectionDetail(@Param() params: GetInspectionDetailDTO, @ActiveUser("staffId") staffId: number) {
        try {
            const data = await this.staffRawTcpClient.send({
                type: "STAFF_GET_INSPECTION_DETAIL", data: {
                    ...params, staffId
                }
            })
            handlerErrorResponse(data)
            return data
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error)
        }
    }
    @Patch("update-inspection-report/:inspectionId")
    async updateInspectionReport(@Body() body: UpdateInspectionReportDTO, @Param() params: GetInspectionDetailDTO, @ActiveUser("staffId") staffId: number) {
        try {
            const data = await this.staffRawTcpClient.send({
                type: "UPDATE_INSPECTION_REPORT", data: {
                    dataInspection: {
                        ...body
                    },
                    inspectionId: params.inspectionId, staffId
                }
            })
            handlerErrorResponse(data)
            return data
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error)
        }
    }
    @Get("get-recent-work-logs")
    async staffGetWorkLogs(@Query() query: GetRecentWorkLogsDTO, @ActiveUser("staffId") staffId: number) {
        try {
            const data = await this.staffRawTcpClient.send({
                type: "STAFF_GET_WORK_LOGS", data: {
                    ...query, staffId
                }
            })
            handlerErrorResponse(data)
            return data
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error)
        }
    }
    @Get("staff-get-performance")
    async staffGetPerformance(@ActiveUser("staffId") staffId: number) {
        try {
            const data = await this.staffRawTcpClient.send({
                type: "STAFF_GET_PERFORMANCE", data: {
                    staffId
                }
            })
            handlerErrorResponse(data)
            return data
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error)
        }
    }
    @Get("staff-get-review-summary")
    async staffGetReviewSummary(@ActiveUser("staffId") staffId: number) {
        try {
            const data = await this.staffRawTcpClient.send({
                type: "STAFF_GET_REVIEW_SUMMARY", data: {
                    staffId
                }
            })
            handlerErrorResponse(data)
            return data
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error)
        }
    }
    @Post("staff-create-work-logs/:bookingId")
    async staffCreateWorkLogs(@Param() param: GetBookingDetailDTO, @ActiveUser("staffId") staffId: number) {
        try {
            const data = await this.staffRawTcpClient.send({
                type: "STAFF_CREATE_WORK_LOG", data: {

                    bookingId: param.bookingId, staffId

                }
            })
            handlerErrorResponse(data)
            return data
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error)
        }
    }
    @Patch("staff-checkout/:bookingId")
    async staffCheckOut(@Param() param: GetBookingDetailDTO) {
        try {
            const data = await this.staffRawTcpClient.send({
                type: "STAFF_CHECK_OUT", data: {

                    bookingId: param.bookingId

                }
            })
            handlerErrorResponse(data)
            return data
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error)
        }
    }
    @Get("staff-get-monthly-stats")
    async staffGetMonthlyStats(@ActiveUser("staffId") staffId: number) {
        try {
            const data = await this.staffRawTcpClient.send({
                type: "STAFF_GET_MONTHLY_STATS", data: {
                    staffId
                }
            })
            handlerErrorResponse(data)
            return data
        } catch (error) {
            if (error instanceof HttpException) throw error;
            handleZodError(error)
        }
    }


}
