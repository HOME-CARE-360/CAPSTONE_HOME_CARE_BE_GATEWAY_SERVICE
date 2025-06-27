import { Controller, Get, Inject, Query } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { handleZodError } from "libs/common/helpers";
import { SERVICE_SERVICE } from "libs/common/src/constants/service-name.constant";
import { ZodSerializerDto } from "nestjs-zod";
import { lastValueFrom } from "rxjs";
import { ApiQuery } from "@nestjs/swagger";
import { IsPublic } from "libs/common/src/decorator/auth.decorator";
import { GetListCategoryQueryDTO, GetListCategoryResDTO } from "libs/common/src/request-response-type/category/category.dto";
import { OrderBy, SortByStaff } from "libs/common/src/constants/others.constant";

@Controller('categories')
export class CategoryGatewayController {
    constructor(
        @Inject(SERVICE_SERVICE) private readonly serviceClient: ClientProxy
    ) { }
    @ApiQuery({ name: 'name', required: false, type: String, description: 'Filter by category name (partial match)' })

    @IsPublic()
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
    @Get('get-list-category')
    @ZodSerializerDto(GetListCategoryResDTO)
    async getListService(@Query() query: GetListCategoryQueryDTO) {
        try {
            return await lastValueFrom(this.serviceClient.send({ cmd: 'get-list-category' }, { query }));
        } catch (error) {
            handleZodError(error)


        }

    }
}
