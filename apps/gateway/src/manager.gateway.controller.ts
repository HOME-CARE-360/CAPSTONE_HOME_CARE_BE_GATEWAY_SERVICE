import { Body, Controller, Inject, Param, Patch, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { UpdateStatusProviderBodyDTO } from "libs/common/src/request-response-type/manager/managers.dto";
import { handleZodError } from "libs/common/helpers";
import { MANAGER_SERVICE } from "libs/common/src/constants/service-name.constant";
import { MessageResDTO } from "libs/common/src/dtos/response.dto";
import { ZodSerializerDto } from "nestjs-zod";
import { lastValueFrom } from "rxjs";
import { ActiveUser } from "libs/common/src/decorator/active-user.decorator";
import { CreateCategoryBodyDTO } from "libs/common/src/request-response-type/category/category.dto";

@Controller('managers')
export class ManagerGatewayController {
    constructor(
        @Inject(MANAGER_SERVICE) private readonly authClient: ClientProxy
    ) { }
    @Patch('change-status-provider')
    @ZodSerializerDto(MessageResDTO)
    async changeStatusProvider(@Body() body: UpdateStatusProviderBodyDTO, @ActiveUser("userId") userId: number) {
        try {
            return await lastValueFrom(this.authClient.send({ cmd: 'change-status-provider' }, { body, userId }));
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
            return await lastValueFrom(this.authClient.send({ cmd: 'create-category' }, { body, userId }));
        } catch (error) {
            handleZodError(error)


        }

    }
    @Patch('update-category/:categoryId')
    @ZodSerializerDto(MessageResDTO)
    async updateCategory(@Param("categoryId") categoryId: number, @Body() body: CreateCategoryBodyDTO, @ActiveUser("userId") userId: number) {
        try {
            return await lastValueFrom(this.authClient.send({ cmd: 'update-category' }, { body, userId, categoryId }));
        } catch (error) {
            handleZodError(error)


        }

    }
}