import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Inject, Logger, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Socket, Server } from 'socket.io';
import { BOOKING_SERVICE } from 'libs/common/src/constants/service-name.constant';
import { WsAccessTokenGuard } from 'libs/common/src/guards/access-token-socket.guard';
import { WsUser } from 'libs/common/src/decorator/active-user.decorator';
import { AccessTokenPayload } from 'libs/common/src/types/jwt.type';
import { CreateMessageBodyType } from 'libs/common/src/request-response-type/chat/chat.model';
@UseGuards(WsAccessTokenGuard)
@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayInit {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(@Inject(BOOKING_SERVICE) private chatClient: ClientProxy) {}

  async afterInit(server: Server) {
    console.log(server);

    await this.chatClient.connect();
    this.logger.log('ChatGateway initialized with Socket.IO server');
  }

  @SubscribeMessage('chat:sendMessage')
  async sendMessage(
    @MessageBody()
    body: CreateMessageBodyType,
    @ConnectedSocket() socket: Socket,
    @WsUser() user: AccessTokenPayload,
  ) {
    const message = await this.chatClient
      .send(
        { cmd: 'create-message' },
        {
          body,
          user,
        },
      )
      .toPromise();

    socket
      .to(`conversation:${body.conversationId}`)
      .emit('chat:newMessage', message);
  }

  @SubscribeMessage('chat:read')
  markRead(
    @MessageBody() dto: { conversationId: number },
    @WsUser() user: AccessTokenPayload,
  ) {
    this.chatClient.emit(
      { cmd: 'mark-messages-as-read' },
      {
        conversationId: dto.conversationId,
        user,
      },
    );


        this.chatClient.emit({ cmd: 'mark-messages-as-read' }, {
            conversationId: dto.conversationId,
            user,
        });

        this.server
            .to(`conversation:${dto.conversationId}`)
            .emit('chat:seen', { conversationId: dto.conversationId, user });
    }
    @SubscribeMessage('chat:joinConversation')
    async handleJoinConversation(
        @MessageBody() { conversationId }: { conversationId: number },
        @WsUser() user: AccessTokenPayload,
        @ConnectedSocket() socket: Socket,
    ) {
        console.log("json ne");

        const isParticipant = await this.chatClient.send({ cmd: 'check-conversation-participant' }, {
            conversationId,
            user
        }).toPromise();
        console.log(isParticipant);


        if (!isParticipant) {
            socket.emit('chat:error', { message: 'Access denied to conversation' });
            return;
        }
        console.log("jói");

        socket.join(`conversation:${conversationId}`);
    }

}
