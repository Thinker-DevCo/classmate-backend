import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { RedisService } from 'src/redis/redis.service';
@WebSocketGateway()
export class SchoolGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer() server: Server;
  constructor(private readonly redis: RedisService) {}
  handleConnection(client: any, ...args: any[]) {
    // throw new Error('Method not implemented.');
  }
  afterInit(server: any) {
    this.redis.subscribe('schoolCreated');
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: any) {
    console.log(body);
  }

  async handleRedisMessage(channel: string, message: string) {
    const data = JSON.parse(message);

    switch (channel) {
      case 'schoolCreated':
        this.server.emit('schoolCreated', data);
        break;
      default:
        this.server.emit(channel, data);
        break;
    }
  }
}
