import { Body, Controller, Get, Inject, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { ZodSerializerDto } from 'nestjs-zod';



import { ApiQuery } from '@nestjs/swagger';
import { VerifiedProviderGuard } from 'libs/common/src/guards/verified-provider.guard';
import { CreateServicesBodyDTO, DeleteServicesParamDTO, GetServiceResDTO, GetServicesForProviderQueryDTO, GetServicesForProviderResDTO, UpdateServicesBodyDTO } from 'libs/common/src/request-response-type/service/services.dto';
import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
import { AccessTokenPayload } from 'libs/common/src/types/jwt.type';
import { OrderBy, SortBy } from 'libs/common/src/constants/others.constant';
import { MessageResDTO } from 'libs/common/src/dtos/response.dto';
import { PROVIDER_SERVICE } from 'libs/common/src/constants/service-name.constant';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleZodError } from 'libs/common/helpers';
import { CreateStaffBodyDTO } from 'libs/common/src/request-response-type/provider/manage-staff/manage-staff.dto';



@Controller('manage-staffs')
@UseGuards(VerifiedProviderGuard)
export class ManageStaffGatewayController {
    constructor(@Inject(PROVIDER_SERVICE) private readonly providerClient: ClientProxy) { }
    @Post("create-staff")

    @ZodSerializerDto(MessageResDTO)
    async createService(@Body() body: CreateStaffBodyDTO, @ActiveUser() user: AccessTokenPayload) {
        try {
            return await lastValueFrom(this.providerClient.send({ cmd: 'create-staff' }, { body, providerID: user.providerId as number }));
        } catch (error) {
            console.log(error);

            handleZodError(error)


        }
    }
    // @Get("/list-service")
    // @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' })
    // @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Items per page' })
    // @ApiQuery({ name: 'name', required: false, type: String, description: 'Filter by service name (partial match)' })
    // @ApiQuery({
    //     name: 'categories',
    //     required: false,
    //     isArray: true,
    //     type: Number,
    //     description: 'List of category IDs to filter by',
    //     example: [4, 7],
    // })
    // @ApiQuery({ name: 'minPrice', required: false, type: Number, description: 'Minimum base price' })
    // @ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Maximum base price' })
    // @ApiQuery({ name: 'createdById', required: false, type: Number, description: 'Filter by creator user ID' })
    // @ApiQuery({
    //     name: 'orderBy',
    //     required: false,
    //     enum: OrderBy,
    //     description: 'Sort order: Asc or Desc',
    //     example: OrderBy.Desc,
    // })
    // @ApiQuery({
    //     name: 'sortBy',
    //     required: false,
    //     enum: SortBy,
    //     description: 'Sort field: CreatedAt, Price, or Discount',
    //     example: SortBy.CreatedAt,
    // })
    // @ZodSerializerDto(GetServicesForProviderResDTO)
    // async list(@Query() query: GetServicesForProviderQueryDTO, @ActiveUser("userId") providerID: number) {
    //     console.log(providerID);
    //     try {
    //         return await lastValueFrom(this.providerClient.send({ cmd: '/list-service' }, { query, providerID }));
    //     } catch (error) {
    //         console.log(error);

    //         handleZodError(error)


    //     }
    // }
    // @Patch("/update-service")
    // @ZodSerializerDto(MessageResDTO)
    // async updateService(@Body() body: UpdateServicesBodyDTO, @ActiveUser() user: AccessTokenPayload) {
    //     try {
    //         return await lastValueFrom(this.providerClient.send({ cmd: '/update-service' }, { body, user }));
    //     } catch (error) {
    //         console.log(error);

    //         handleZodError(error)


    //     }
    // }
    // @Patch("/delete-service/:serviceId")
    // @ZodSerializerDto(UpdateServicesBodyDTO)
    // async deleteService(@Param() serviceID: DeleteServicesParamDTO, @ActiveUser() user: AccessTokenPayload) {
    //     try {
    //         return await lastValueFrom(this.providerClient.send({ cmd: '/delete-service' }, { serviceID, user }));
    //     } catch (error) {
    //         console.log(error);

    //         handleZodError(error)


    //     }
    // }
    // @Get("/detail/:serviceId")
    // @ZodSerializerDto(GetServiceResDTO)
    // async getDetailService(@Param() serviceID: DeleteServicesParamDTO, @ActiveUser() user: AccessTokenPayload) {
    //     try {
    //         return await lastValueFrom(this.providerClient.send({ cmd: '/detail' }, { serviceID, user }));
    //     } catch (error) {
    //         console.log(error);

    //         handleZodError(error)


    //     }
    // }

}
