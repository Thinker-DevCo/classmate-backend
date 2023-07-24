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
    this.redis.setSchoolGateway(this);
    this.redis
      .subscribe('schoolCreated')
      .then(() => {
        console.log('Subscribed to schoolCreated channel');
      })
      .catch((err) => {
        console.error('Error subscribing to schoolCreated channel');
        console.error(err);
      });
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
      case 'schoolUpdate':
        this.server.emit('schoolDelete', {
          message: 'schoolCreated',
          content: message,
        });
        break;
      default:
        null;
    }
  }
}
