import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Inject, Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WsAccessTokenGuard } from 'libs/common/src/guards/access-token-socket.guard';
import { WsUser } from 'libs/common/src/decorator/active-user.decorator';
import { AccessTokenPayload } from 'libs/common/src/types/jwt.type';
import { RawTcpClientService } from 'libs/common/src/tcp/raw-tcp-client.service';
import { USER_SERVICE } from 'libs/common/src/constants/service-name.constant';
import { handlerErrorResponse } from 'libs/common/helpers';

const roomOfUser = (id: number) => `user:${id}`;

@UseGuards(WsAccessTokenGuard)
@WebSocketGateway({
  cors: true,
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(USER_SERVICE)
    private readonly notiClient: RawTcpClientService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('🚀 NotificationsGateway initialized successfully');
    this.logger.log(
      `📡 WebSocket server listening on namespace: /notifications`,
    );
  }

  handleConnection(socket: Socket) {
    this.logger.log(`🔗 New socket connection: ${socket.id}`);

    // Log client info
    const clientInfo = {
      socketId: socket.id,
      remoteAddress: socket.handshake.address,
      userAgent: socket.handshake.headers['user-agent'],
      timestamp: new Date().toISOString(),
    };
    this.logger.debug(`Client info: ${JSON.stringify(clientInfo)}`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`❌ Socket disconnected: ${socket.id}`);
  }

  @SubscribeMessage('notifications:subscribe')
  handleSubscribe(
    @ConnectedSocket() socket: Socket,
    @WsUser() user: AccessTokenPayload,
  ) {
    const userId = Number(user.userId);
    if (!userId) {
      this.logger.warn(
        `⚠️ Unauthorized WebSocket subscription attempt from socket: ${socket.id}`,
      );
      return { success: false, message: 'Unauthorized' };
    }

    const userRoom = roomOfUser(userId);
    socket.join(userRoom);

    // Enhanced logging
    this.logger.log(`✅ User ${userId} subscribed successfully`);
    this.logger.log(`🏠 Socket ${socket.id} joined room: ${userRoom}`);
    this.logger.debug(
      `👥 Room ${userRoom} now has ${this.server.sockets.adapter.rooms.get(userRoom)?.size || 0} members`,
    );

    // Send hello message
    socket.emit('system:hello', {
      userId,
      ts: Date.now(),
      socketId: socket.id,
      room: userRoom,
    });

    return { success: true, socketId: socket.id, room: userRoom };
  }

  // Method to push notifications (for external calls)
  pushNewNotification(userId: number, payload: any) {
    const userRoom = roomOfUser(userId);
    const roomSize = this.server.sockets.adapter.rooms.get(userRoom)?.size || 0;

    if (roomSize > 0) {
      this.server.to(userRoom).emit('notification:new', payload);
      this.logger.log(
        `📨 Pushed notification to ${roomSize} client(s) in room: ${userRoom}`,
      );
      this.logger.debug(`📄 Notification payload: ${JSON.stringify(payload)}`);
    } else {
      this.logger.warn(
        `⚠️ No clients in room ${userRoom} to receive notification`,
      );
    }
  }

  @SubscribeMessage('notifications:listUnread')
  async listUnread(
    @MessageBody() query: { page?: number; limit?: number },
    @WsUser() user: AccessTokenPayload,
  ) {
    const startTime = Date.now();
    try {
      this.logger.debug(
        `📖 Fetching unread notifications for user ${user.userId}`,
      );

      const response = await this.notiClient.send({
        type: 'GET_UNREAD_IN_APP_NOTIFICATIONS',
        userId: Number(user.userId),
        page: Number(query?.page) > 0 ? Number(query.page) : 1,
        limit: Number(query?.limit) > 0 ? Number(query.limit) : 10,
      });

      handlerErrorResponse(response);
      const duration = Date.now() - startTime;
      this.logger.log(
        `✅ Unread notifications fetched for user ${user.userId} in ${duration}ms`,
      );

      return { success: true, ...response };
    } catch (err: any) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `❌ listUnread error for user ${user.userId} after ${duration}ms: ${err?.message || err}`,
      );
      return {
        success: false,
        message: err?.message || 'Failed to retrieve unread notifications',
      };
    }
  }

  @SubscribeMessage('notifications:listAll')
  async listAll(
    @MessageBody() query: { page?: number; limit?: number },
    @WsUser() user: AccessTokenPayload,
  ) {
    const startTime = Date.now();
    try {
      this.logger.debug(
        `📋 Fetching all notifications for user ${user.userId}`,
      );

      const response = await this.notiClient.send({
        type: 'GET_ALL_IN_APP_NOTIFICATIONS',
        userId: Number(user.userId),
        page: Number(query?.page) > 0 ? Number(query.page) : 1,
        limit: Number(query?.limit) > 0 ? Number(query.limit) : 10,
      });

      handlerErrorResponse(response);
      const duration = Date.now() - startTime;
      this.logger.log(
        `✅ All notifications fetched for user ${user.userId} in ${duration}ms`,
      );

      return { success: true, ...response };
    } catch (err: any) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `❌ listAll error for user ${user.userId} after ${duration}ms: ${err?.message || err}`,
      );
      return {
        success: false,
        message: err?.message || 'Failed to retrieve all notifications',
      };
    }
  }

  @SubscribeMessage('notifications:markRead')
  async markRead(
    @MessageBody() payload: { notificationId: number },
    @WsUser() user: AccessTokenPayload,
  ) {
    try {
      this.logger.debug(
        `📝 Marking notification ${payload.notificationId} as read by user ${user.userId}`,
      );

      const response = await this.notiClient.send({
        type: 'MARK_IN_APP_NOTIFICATION_AS_READ',
        notificationId: Number(payload.notificationId),
      });

      handlerErrorResponse(response);
      this.logger.log(
        `✅ Marked notification ${payload.notificationId} as read by user ${user.userId}`,
      );

      return { success: true, ...response };
    } catch (err: any) {
      this.logger.error(
        `❌ markRead error for notification ${payload.notificationId} by user ${user.userId}: ${err?.message || err}`,
      );
      return {
        success: false,
        message: err?.message || 'Failed to mark notification as read',
      };
    }
  }

  @SubscribeMessage('notifications:markAllRead')
  async markAllRead(@WsUser() user: AccessTokenPayload) {
    try {
      this.logger.debug(
        `📝 Marking all notifications as read for user ${user.userId}`,
      );

      const response = await this.notiClient.send({
        type: 'MARK_ALL_IN_APP_NOTIFICATIONS_AS_READ_FOR_USER',
        userId: Number(user.userId),
      });

      handlerErrorResponse(response);
      this.logger.log(
        `✅ Marked all notifications as read for user ${user.userId}`,
      );

      return { success: true, ...response };
    } catch (err: any) {
      this.logger.error(
        `❌ markAllRead error for user ${user.userId}: ${err?.message || err}`,
      );
      return {
        success: false,
        message: err?.message || 'Failed to mark all notifications as read',
      };
    }
  }

  @SubscribeMessage('notifications:delete')
  async deleteNotification(
    @MessageBody() payload: { notificationId: number },
    @WsUser() user: AccessTokenPayload,
  ) {
    try {
      this.logger.debug(
        `🗑️ Deleting notification ${payload.notificationId} by user ${user.userId}`,
      );

      const response = await this.notiClient.send({
        type: 'DELETE_IN_APP_NOTIFICATION',
        notificationId: Number(payload.notificationId),
      });

      handlerErrorResponse(response);
      this.logger.log(
        `✅ Deleted notification ${payload.notificationId} by user ${user.userId}`,
      );

      return { success: true, ...response };
    } catch (err: any) {
      this.logger.error(
        `❌ deleteNotification error for notification ${payload.notificationId} by user ${user.userId}: ${err?.message || err}`,
      );
      return {
        success: false,
        message: err?.message || 'Failed to delete notification',
      };
    }
  }
}
