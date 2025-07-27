import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { UpdateStatusProviderBodyDTO, UpdateStatusServiceBodyDTO } from "libs/common/src/request-response-type/manager/managers.dto";
import { handleZodError } from "libs/common/helpers";
import { MANAGER_SERVICE } from "libs/common/src/constants/service-name.constant";
import { MessageResDTO } from "libs/common/src/dtos/response.dto";
import { ZodSerializerDto } from "nestjs-zod";
import { lastValueFrom } from "rxjs";
import { ActiveUser } from "libs/common/src/decorator/active-user.decorator";
import { CreateCategoryBodyDTO, UpdateCategoryQueryDTO } from "libs/common/src/request-response-type/category/category.dto";
import { GetListWidthDrawQueryDTO, GetWidthDrawDetailParamsDTO, UpdateWithDrawalBodyDTO } from "libs/common/src/request-response-type/with-draw/with-draw.dto";
import { ApiQuery } from "@nestjs/swagger";
import { WithdrawalStatus } from "@prisma/client";
import { OrderBy, SortByWithDraw } from "libs/common/src/constants/others.constant";

@Controller('managers')
export class ManagerGatewayController {
    constructor(
        @Inject(MANAGER_SERVICE) private readonly managerClient: ClientProxy
    ) { }
    @Patch('change-status-provider')
    @ZodSerializerDto(MessageResDTO)
    async changeStatusProvider(@Body() body: UpdateStatusProviderBodyDTO, @ActiveUser("userId") userId: number) {
        try {
            return await lastValueFrom(this.managerClient.send({ cmd: 'change-status-provider' }, { body, userId }));
        } catch (error) {
            console.log("o day ne");

            console.log(error);
            handleZodError(error)


        }

    }
    @Patch('change-status-service')
    @ZodSerializerDto(MessageResDTO)
    async changeStatusService(@Body() body: UpdateStatusServiceBodyDTO) {
        try {
            return await lastValueFrom(this.managerClient.send({ cmd: 'change-status-service' }, { body }));
        } catch (error) {
            console.log("o day ne");

            console.log(error);
            handleZodError(error)


        }

    }

    @Post('create-category')
    @ZodSerializerDto(MessageResDTO)
    async createCategory(@Body() body: CreateCategoryBodyDTO, @ActiveUser("userId") userId: number) {
        try {
            return await lastValueFrom(this.managerClient.send({ cmd: 'create-category' }, { body, userId }));
        } catch (error) {
            handleZodError(error)


        }

    }
    @Patch('update-category/:categoryId')
    @ZodSerializerDto(MessageResDTO)
    async updateCategory(@Param() params: UpdateCategoryQueryDTO, @Body() body: CreateCategoryBodyDTO, @ActiveUser("userId") userId: number) {
        try {
            return await lastValueFrom(this.managerClient.send({ cmd: 'update-category' }, { body, userId, categoryId: params.categoryId }));
        } catch (error) {
            handleZodError(error)


        }
    }
    @Delete('delete-category/:categoryId')
    @ZodSerializerDto(MessageResDTO)
    async deleteCategory(@Param() params: UpdateCategoryQueryDTO, @ActiveUser("userId") userId: number) {
        try {
            return await lastValueFrom(this.managerClient.send({ cmd: 'delete-category' }, { userId, categoryId: params.categoryId }));
        } catch (error) {
            handleZodError(error)
        }
    }
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number (default = 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Items per page (default = 10)' })
    @ApiQuery({ name: 'providerName', required: false, type: String, description: 'Filter by provider name (optional)' })
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
            return await lastValueFrom(this.managerClient.send({ cmd: 'get-list-withdraw' }, { ...query }));
        } catch (error) {
            handleZodError(error)
        }
    }
    @Get('get-withdraw-detail/:id')
    @ZodSerializerDto(MessageResDTO)
    async getWithDrawDetail(@Param() param: GetWidthDrawDetailParamsDTO) {
        try {
            return await lastValueFrom(this.managerClient.send({ cmd: 'get-withdraw-detail' }, { id: param.id }));
        } catch (error) {
            handleZodError(error)
        }
    }
    @Patch('update-withdraw')
    @ZodSerializerDto(MessageResDTO)
    async updateWithdraw(@Body() body: UpdateWithDrawalBodyDTO, @ActiveUser("userId") userId: number) {
        try {
            return await lastValueFrom(this.managerClient.send({ cmd: 'update-withdraw' }, { body, userId }));
        } catch (error) {
            handleZodError(error)
        }
    }

}