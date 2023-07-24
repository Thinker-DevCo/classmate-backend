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
    this.redis
      .subscribe('schoolCreated')
      .then(() => console.log('subscribed successfully'))
      .catch((err) => console.log('error subscribing'));
  }

  @SubscribeMessage('message')
  async handleRedisMessage(channel: string, message: string) {
    const data = JSON.parse(message);
    console.log('data', data);
    this.server.emit('schoolCreated', data);
  }
}
