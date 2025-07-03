import { Body, Controller, Delete, Inject, Param, Patch, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { UpdateStatusProviderBodyDTO, UpdateStatusServiceBodyDTO } from "libs/common/src/request-response-type/manager/managers.dto";
import { handleZodError } from "libs/common/helpers";
import { MANAGER_SERVICE } from "libs/common/src/constants/service-name.constant";
import { MessageResDTO } from "libs/common/src/dtos/response.dto";
import { ZodSerializerDto } from "nestjs-zod";
import { lastValueFrom } from "rxjs";
import { ActiveUser } from "libs/common/src/decorator/active-user.decorator";
import { CreateCategoryBodyDTO, UpdateCategoryQueryDTO } from "libs/common/src/request-response-type/category/category.dto";

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
}