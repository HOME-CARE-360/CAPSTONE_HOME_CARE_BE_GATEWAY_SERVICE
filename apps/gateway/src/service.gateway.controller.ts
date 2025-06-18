import { Controller, Get, Inject, Param, Query } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { handleZodError } from "libs/common/helpers";
import { SERVICE_SERVICE } from "libs/common/src/constants/service-name.constant";
import { ZodSerializerDto } from "nestjs-zod";
import { lastValueFrom } from "rxjs";
import { ApiQuery } from "@nestjs/swagger";
import { OrderBy, SortBy } from "libs/common/src/constants/others.constant";
import { IsPublic } from "libs/common/src/decorator/auth.decorator";
import { DeleteServicesParamDTO, GetServiceResDTO, GetServicesQueryDTO, GetServicesResDTO } from "libs/common/src/request-response-type/service/services.dto";

@Controller('services')
export class ServiceGatewayController {
    constructor(
        @Inject(SERVICE_SERVICE) private readonly serviceClient: ClientProxy
    ) { }
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Items per page' })
    @ApiQuery({ name: 'name', required: false, type: String, description: 'Filter by service name (partial match)' })
    @ApiQuery({
        name: 'providerIds',
        required: false,
        isArray: true,
        type: Number,
        description: 'List of provider IDs to filter by',
        example: [1, 3],
    })
    @ApiQuery({
        name: 'categories',
        required: false,
        isArray: true,
        type: Number,
        description: 'List of category IDs to filter by',
        example: [4, 7],
    })
    @ApiQuery({ name: 'minPrice', required: false, type: Number, description: 'Minimum base price' })
    @ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Maximum base price' })
    @ApiQuery({ name: 'createdById', required: false, type: Number, description: 'Filter by creator user ID' })
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
        description: 'Sort field: CreatedAt',
        example: SortBy.CreatedAt,
    })
    @IsPublic()
    @Get('get-list-service')
    @ZodSerializerDto(GetServicesResDTO)
    async getListService(@Query() query: GetServicesQueryDTO) {
        try {
            console.log(query);

            return await lastValueFrom(this.serviceClient.send({ cmd: 'get-list-service' }, { query }));
        } catch (error) {
            handleZodError(error)


        }

    }
    @IsPublic()
    @Get("detail/:serviceId")
    @ZodSerializerDto(GetServiceResDTO)
    async getDetailService(@Param() serviceID: DeleteServicesParamDTO) {
        try {
            return await lastValueFrom(this.serviceClient.send({ cmd: 'detail' }, { serviceID: serviceID.serviceId }));
        } catch (error) {
            handleZodError(error)


        }
    }
}
