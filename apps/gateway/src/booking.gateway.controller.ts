import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { handleZodError } from 'libs/common/helpers';
import { BOOKING_SERVICE } from 'libs/common/src/constants/service-name.constant';
import { ZodSerializerDto } from 'nestjs-zod';
import { lastValueFrom } from 'rxjs';
import { GetListCategoryResDTO } from 'libs/common/src/request-response-type/category/category.dto';
import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
import { AccessTokenPayload } from 'libs/common/src/types/jwt.type';
import { CreateServiceRequestBodySchemaDTO } from 'libs/common/src/request-response-type/bookings/booking.dto';
import {
  CreateConversationBodyDTO,
  GetListMessageQueryDTO,
} from 'libs/common/src/request-response-type/chat/chat.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('bookings')
export class BookingsGatewayController {
  constructor(
    @Inject(BOOKING_SERVICE) private readonly bookingClient: ClientProxy,
  ) {}
  @Post('create-service-request')
  @ZodSerializerDto(GetListCategoryResDTO)
  async getListService(
    @Body() body: CreateServiceRequestBodySchemaDTO,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    try {
      const data = await lastValueFrom(
        this.bookingClient.send(
          { cmd: 'create-service-request' },
          { body, userId: user.userId, customerID: user.customerId },
        ),
      );
      console.log(data);
      if (data?.statusCode && data.statusCode >= 400) {
        throw new HttpException(
          {
            error: data.error ?? 'Internal Server Error',
            message: data.message ?? 'Unknown error',
          },
          data.statusCode,
        );
      }
      return data;
    } catch (error) {
      console.log(error);

      handleZodError(error);
    }
  }
  @Get('get-user-conversation')
  async getUserConversation(@ActiveUser() user: AccessTokenPayload) {
    try {
      return await lastValueFrom(
        this.bookingClient.send({ cmd: 'get-user-conversation' }, { user }),
      );
    } catch (error) {
      console.log(error);

      handleZodError(error);
    }
  }
  @ApiQuery({
    name: 'conversationId',
    required: true,
  })
  @Get('get-messages')
  async getMessages(
    @Query() query: GetListMessageQueryDTO,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    try {
      return await lastValueFrom(
        this.bookingClient.send({ cmd: 'get-messages' }, { user, query }),
      );
    } catch (error) {
      console.log(error);

      handleZodError(error);
    }
  }
  @Post('get-or-create-conversation')
  async getOrCreateConversation(
    @Body() body: CreateConversationBodyDTO,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    try {
      return await lastValueFrom(
        this.bookingClient.send(
          { cmd: 'get-or-create-conversation' },
          { user, receiverId: body.receiverId },
        ),
      );
    } catch (error) {
      console.log(error);

      handleZodError(error);
    }
  }
}
