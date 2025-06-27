import { Body, Controller, Get, Inject, Param, Patch, Post, Query, } from '@nestjs/common';
import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
import { STAFF_SERVICE, USER_SERVICE } from 'libs/common/src/constants/service-name.constant';

import { handleZodError } from 'libs/common/helpers';

import { RawTcpClientService } from 'libs/common/src/tcp/raw-tcp-client.service';
import { CreateInspectionReportDTO, GetBookingBelongToStaffQueryDTO, GetBookingDetailDTO, StaffGetReviewQueryDTO, UpdateUserAndStaffProfileDTO } from 'libs/common/src/request-response-type/staff/staff.dto';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
@Controller('staffs')
export class StaffGatewayController {
    constructor(@Inject(USER_SERVICE) private readonly userRawTcpClient: RawTcpClientService, @Inject(STAFF_SERVICE) private readonly staffRawTcpClient: RawTcpClientService) { }

    @Patch('update-staff-information')
    async getUserInformation(@Body() body: UpdateUserAndStaffProfileDTO, @ActiveUser("staffId") staffId: number) {
        try {
            const data = await this.userRawTcpClient.send({ type: 'UPDATE_STAFF', staffId, data: { ...body } })
            console.log(data);
            return data
        } catch (error) {
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
            return data
        } catch (error) {
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
            return data
        } catch (error) {
            handleZodError(error)
        }
    }
    @Get("get-booking-detail/:booking-id")
    async getBookingDetail(@Param() params: GetBookingDetailDTO, @ActiveUser("staffId") staffId: number) {
        try {
            const data = await this.staffRawTcpClient.send({
                type: "STAFF_CREATE_INSPECTION_REPORT", data: {
                    ...params, staffId
                }
            })
            return data
        } catch (error) {
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
            return data;
        } catch (error) {
            handleZodError(error);
        }
    }



}
