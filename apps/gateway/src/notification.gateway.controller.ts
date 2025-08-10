// import {
//   Body,
//   Controller,
//   Get,
//   HttpException,
//   Inject,
//   Param,
//   ParseIntPipe,
//   Patch,
//   Post,
//   Query,
//   Delete,
// } from '@nestjs/common';
// import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
// import { handlerErrorResponse, handleZodError } from 'libs/common/helpers';
// import { NOTIFICATION_SERVICE } from 'libs/common/src/constants/service-name.constant';
// import { ActiveUser } from 'libs/common/src/decorator/active-user.decorator';
// import { RawTcpClientService } from 'libs/common/src/tcp/raw-tcp-client.service';
// import { z } from 'zod';

// export const SendNotificationBodySchema = z.object({
//   templateName: z.string().min(1),
//   data: z.record(z.any()).optional().default({}),
//   channels: z.array(z.enum(['push', 'in-app'])).min(1),
// });
// export type SendNotificationDto = z.infer<typeof SendNotificationBodySchema>;

// export const NotificationQuerySchema = z.object({
//   page: z.coerce.number().int().positive().optional().default(1),
//   limit: z.coerce.number().int().positive().optional().default(10),
// });
// export type NotificationQueryDTO = z.infer<typeof NotificationQuerySchema>;

// @ApiTags('Notifications')
// @ApiBearerAuth()
// @Controller('notifications')
// export class NotificationGatewayController {
//   constructor(
//     @Inject(NOTIFICATION_SERVICE)
//     private readonly notificationRawTcpClient: RawTcpClientService,
//   ) {}

//   @Post('send')
//   async sendNotification(
//     @Body() body: SendNotificationDto,
//     @ActiveUser('userId') userId: number,
//   ) {
//     try {
//       const parsed = SendNotificationBodySchema.parse(body);
//       const data = await this.notificationRawTcpClient.send({
//         type: 'SEND_NOTIFICATION',
//         userId,
//         ...parsed,
//       });
//       handlerErrorResponse(data);
//       return data;
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       handleZodError(error);
//     }
//   }

//   @Patch(':notificationId/read')
//   async markNotificationAsRead(
//     @Param('notificationId', ParseIntPipe) notificationId: number,
//     @ActiveUser('userId') userId: number,
//   ) {
//     try {
//       const data = await this.notificationRawTcpClient.send({
//         type: 'MARK_IN_APP_NOTIFICATION_AS_READ',
//         notificationId,
//         userId,
//       });
//       handlerErrorResponse(data);
//       return data;
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       handleZodError(error);
//     }
//   }

//   @Get('unread')
//   @ApiQuery({ name: 'page', required: false, type: Number })
//   @ApiQuery({ name: 'limit', required: false, type: Number })
//   async getUnreadNotifications(
//     @ActiveUser('userId') userId: number,
//     @Query() rawQuery: any,
//   ) {
//     try {
//       const parsed = NotificationQuerySchema.safeParse(rawQuery ?? {});
//       const { page, limit } = parsed.success
//         ? parsed.data
//         : { page: 1, limit: 10 };

//       const data = await this.notificationRawTcpClient.send({
//         type: 'GET_UNREAD_IN_APP_NOTIFICATIONS',
//         userId,
//         page,
//         limit,
//       });
//       handlerErrorResponse(data);
//       return data;
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       handleZodError(error);
//     }
//   }

//   @Get()
//   @ApiQuery({ name: 'page', required: false, type: Number })
//   @ApiQuery({ name: 'limit', required: false, type: Number })
//   async getAllNotifications(
//     @ActiveUser('userId') userId: number,
//     @Query() rawQuery: any,
//   ) {
//     try {
//       const parsed = NotificationQuerySchema.safeParse(rawQuery ?? {});
//       const { page, limit } = parsed.success
//         ? parsed.data
//         : { page: 1, limit: 10 };

//       const data = await this.notificationRawTcpClient.send({
//         type: 'GET_ALL_IN_APP_NOTIFICATIONS',
//         userId,
//         page,
//         limit,
//       });
//       handlerErrorResponse(data);
//       return data;
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       handleZodError(error);
//     }
//   }

//   @Patch('read-all')
//   async markAllNotificationsAsRead(@ActiveUser('userId') userId: number) {
//     try {
//       const data = await this.notificationRawTcpClient.send({
//         type: 'MARK_ALL_IN_APP_NOTIFICATIONS_AS_READ_FOR_USER',
//         userId,
//       });
//       handlerErrorResponse(data);
//       return data;
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       handleZodError(error);
//     }
//   }

//   @Delete(':notificationId')
//   async deleteNotification(
//     @Param('notificationId', ParseIntPipe) notificationId: number,
//     @ActiveUser('userId') userId: number,
//   ) {
//     try {
//       const data = await this.notificationRawTcpClient.send({
//         type: 'DELETE_IN_APP_NOTIFICATION',
//         notificationId,
//         userId,
//       });
//       handlerErrorResponse(data);
//       return data;
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       handleZodError(error);
//     }
//   }
// }
