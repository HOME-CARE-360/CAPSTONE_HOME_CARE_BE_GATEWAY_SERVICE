


import { VerifiedProviderGuard } from 'libs/common/src/guards/verified-provider.guard'; import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
import { PROVIDER_SERVICE } from 'libs/common/src/constants/service-name.constant';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleZodError } from 'libs/common/helpers';
import { Controller, Get, Inject, Param, Query, UseGuards } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { MessageResDTO } from 'libs/common/src/dtos/response.dto';
import { GetListWidthDrawProviderQueryDTO, GetWidthDrawDetailParamsDTO } from 'libs/common/src/request-response-type/with-draw/with-draw.dto';
import { ApiQuery } from '@nestjs/swagger';
import { WithdrawalStatus } from '@prisma/client';
import { OrderBy, SortByWithDraw } from 'libs/common/src/constants/others.constant';



@Controller('manage-funding')
@UseGuards(VerifiedProviderGuard)
export class ManageFundingGatewayController {
    constructor(@Inject(PROVIDER_SERVICE) private readonly providerClient: ClientProxy) { }
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number (default = 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Items per page (default = 10)' })
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
    async getListWithDraw(@Query() query: GetListWidthDrawProviderQueryDTO, @ActiveUser("providerId") providerId: number) {
        try {
            return await lastValueFrom(this.providerClient.send({ cmd: 'get-list-withdraw' }, { query, providerId }));
        } catch (error) {
            handleZodError(error)
        }
    }
    @Get('get-withdraw-detail/:id')
    @ZodSerializerDto(MessageResDTO)
    async getWithDrawDetail(@Param() param: GetWidthDrawDetailParamsDTO, @ActiveUser("providerId") providerId: number) {
        try {
            return await lastValueFrom(this.providerClient.send({ cmd: 'get-withdraw-detail' }, { id: param.id, providerId }));
        } catch (error) {
            handleZodError(error)
        }
    }
}