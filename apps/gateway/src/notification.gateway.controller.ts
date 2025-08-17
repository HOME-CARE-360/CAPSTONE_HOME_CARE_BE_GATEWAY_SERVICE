// import {
//   WebSocketGateway,
//   WebSocketServer,
//   SubscribeMessage,
//   ConnectedSocket,
//   MessageBody,
// } from '@nestjs/websockets';
// import { Inject, UseGuards } from '@nestjs/common';
// import { Server, Socket } from 'socket.io';
// import { WsAccessTokenGuard } from 'libs/common/src/guards/access-token-socket.guard';
// import { WsUser } from 'libs/common/src/decorator/active-user.decorator';
// import { AccessTokenPayload } from 'libs/common/src/types/jwt.type';
// import { RawTcpClientService } from 'libs/common/src/tcp/raw-tcp-client.service';
// import { NOTIFICATION_SERVICE } from 'libs/common/src/constants/service-name.constant';
// import { handlerErrorResponse } from 'libs/common/helpers';

// const roomOfUser = (id: number) => `user:${id}`;

// @UseGuards(WsAccessTokenGuard)
// @WebSocketGateway({
//   cors: true,
//   namespace: '/notifications',
// })
// export class NotificationsGateway {
//   @WebSocketServer()
//   server: Server;
//   constructor(
//     @Inject(NOTIFICATION_SERVICE)
//     private readonly notificationRawTcpClient: RawTcpClientService,
//   ) {}

//   @SubscribeMessage('notifications:subscribe')
//   handleSubscribe(
//     @ConnectedSocket() socket: Socket,
//     @WsUser() user: AccessTokenPayload,
//   ) {
//     const userId = Number(user.userId);
//     if (!userId) {
//       console.warn('Unauthorized WebSocket subscription attempt.');
//       return { success: false, message: 'Unauthorized' };
//     }

//     socket.join(roomOfUser(userId));
//     socket.emit('system:hello', { userId, ts: Date.now() });
//     console.log(`User ${userId} subscribed to notifications and joined room.`);
//     return { success: true };
//   }
//   pushNewNotification(userId: number, payload: any) {
//     this.server.to(roomOfUser(userId)).emit('notification:new', payload);
//     console.log(`New notification pushed to user ${userId}:`, payload);
//   }

//   @SubscribeMessage('notifications:listUnread')
//   async listUnread(
//     @MessageBody() query: { page?: number; limit?: number },
//     @WsUser() user: AccessTokenPayload,
//   ) {
//     try {
//       const response = await this.notificationRawTcpClient.send({
//         type: 'GET_UNREAD_IN_APP_NOTIFICATIONS',
//         userId: Number(user.userId),
//         page: query?.page ?? 1,
//         limit: query?.limit ?? 10,
//       });

//       handlerErrorResponse(response);
//       console.log(`Unread notifications retrieved for user ${user.userId}.`);
//       return { success: true, ...response };
//     } catch (err: any) {
//       console.error(`Error listing unread notifications for user ${user.userId}:`, err.message);
//       return { success: false, message: err.message || 'Failed to retrieve unread notifications' };
//     }
//   }

//   @SubscribeMessage('notifications:listAll')
//   async listAll(
//     @MessageBody() query: { page?: number; limit?: number },
//     @WsUser() user: AccessTokenPayload,
//   ) {
//     try {
//       const response = await this.notificationRawTcpClient.send({
//         type: 'GET_ALL_IN_APP_NOTIFICATIONS',
//         userId: Number(user.userId),
//         page: query?.page ?? 1,
//         limit: query?.limit ?? 10,
//       });

//       handlerErrorResponse(response);
//       console.log(`All notifications retrieved for user ${user.userId}.`);
//       return { success: true, ...response };
//     } catch (err: any) {
//       console.error(`Error listing all notifications for user ${user.userId}:`, err.message);
//       return { success: false, message: err.message || 'Failed to retrieve all notifications' };
//     }
//   }

//   @SubscribeMessage('notifications:markRead')
//   async markRead(
//     @MessageBody() payload: { notificationId: number },
//     @WsUser() user: AccessTokenPayload,
//   ) {
//     try {
//       const response = await this.notificationRawTcpClient.send({
//         type: 'MARK_IN_APP_NOTIFICATION_AS_READ',
//         notificationId: payload.notificationId,
//       });
//       handlerErrorResponse(response);
//       console.log(`Notification ${payload.notificationId} marked as read for user ${user.userId}.`);
//       return { success: true, ...response };
//     } catch (err: any) {
//       console.error(`Error marking notification ${payload.notificationId} as read for user ${user.userId}:`, err.message);
//       return { success: false, message: err.message || 'Failed to mark notification as read' };
//     }
//   }

//   @SubscribeMessage('notifications:markAllRead')
//   async markAllRead(
//     @WsUser() user: AccessTokenPayload,
//   ) {
//     try {
//       const response = await this.notificationRawTcpClient.send({
//         type: 'MARK_ALL_IN_APP_NOTIFICATIONS_AS_READ_FOR_USER',
//         userId: Number(user.userId),
//       });
//       handlerErrorResponse(response);
//       console.log(`All notifications marked as read for user ${user.userId}.`);
//       return { success: true, ...response };
//     } catch (err: any) {
//       console.error(`Error marking all notifications as read for user ${user.userId}:`, err.message);
//       return { success: false, message: err.message || 'Failed to mark all notifications as read' };
//     }
//   }

//   @SubscribeMessage('notifications:delete')
//   async deleteNotification(
//     @MessageBody() payload: { notificationId: number },
//     @WsUser() user: AccessTokenPayload,
//   ) {
//     try {
//       const response = await this.notificationRawTcpClient.send({
//         type: 'DELETE_IN_APP_NOTIFICATION',
//         notificationId: payload.notificationId,
//       });
//       handlerErrorResponse(response);
//       console.log(`Notification ${payload.notificationId} deleted for user ${user.userId}.`);
//       return { success: true, ...response };
//     } catch (err: any) {
//       console.error(`Error deleting notification ${payload.notificationId} for user ${user.userId}:`, err.message);
//       return { success: false, message: err.message || 'Failed to delete notification' };
//     }
//   }
// }
