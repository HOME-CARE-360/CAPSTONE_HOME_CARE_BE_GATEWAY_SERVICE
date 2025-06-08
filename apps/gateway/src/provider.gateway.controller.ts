import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { handleZodError } from "libs/common/helpers";
import { PROVIDER_SERVICE } from "libs/common/src/constants/service-name.constant";
import { IsPublic } from "libs/common/src/decorator/auth.decorator";
import { MessageResDTO } from "libs/common/src/dtos/response.dto";
import { ZodSerializerDto } from "nestjs-zod";
import { lastValueFrom } from "rxjs";
import { PresignedUploadFileBodyDTO } from "libs/common/src/request-response-type/media/media.dto";

@Controller('media')
export class ProviderGatewayController {
    constructor(
        @Inject(PROVIDER_SERVICE) private readonly providerClient: ClientProxy
    ) { }
    @IsPublic()
    @Post('images/upload/presigned-url')
    @ZodSerializerDto(MessageResDTO)
    async changeStatusProvider(@Body() body: PresignedUploadFileBodyDTO) {
        try {
            return await lastValueFrom(this.providerClient.send({ cmd: 'images/upload/presigned-url' }, body));
        } catch (error) {
            handleZodError(error)
        }

    }
}