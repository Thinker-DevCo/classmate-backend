import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { channel } from 'diagnostics_channel';
import { Socket, Server } from 'socket.io';
import { RedisService } from 'src/redis/redis.service';

@WebSocketGateway()
export class SchoolGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly redis: RedisService) {}

  afterInit(server: Server) {
    this.redis.subscribe('schoolCreated', server);
    this.redis.subscribe('schoolUpdated', server);
    this.redis.subscribe('schoolDeleted', server);
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: any) {
    console.log(body);
    this.server.emit('newMessage', body);
  }

  async handleRedisMessage(channel: string, message: string) {
    switch (channel) {
      case 'schoolCreated':
        this.server.emit('schoolCreated', {
          message: 'schoolCreated',
          content: message,
        });
        break;
      case 'schoolUpdated':
        this.server.emit('schoolUpdated', {
          message: 'schoolUpdated',
          content: message,
        });
        break;
      case 'schoolDeleted':
        this.server.emit('schoolDeleted', {
          message: 'schoolDeleted',
          content: message,
        });
        break;
      default:
        this.server.emit('redisMessage', {
          channel,
          content: message,
        });
    }
  }
}
