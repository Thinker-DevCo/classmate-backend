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
  @WebSocketServer()
  server: Server;

  constructor(private readonly redis: RedisService) {}

  afterInit(server: Server) {
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
  @SubscribeMessage('schoolCreated')
  handleRedisMessage(@MessageBody() message: string) {
    const data = JSON.parse(message);
    this.server.emit('schoolCreated', {
      message: 'worked',
      content: data,
    });
  }
}
