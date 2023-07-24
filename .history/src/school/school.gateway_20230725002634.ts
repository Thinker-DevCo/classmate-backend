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

  constructor() {}

  afterInit(server: Server) {
    this.subscribeToSchoolCreated;
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: any) {
    console.log(body);
    this.server.emit('newMessage', body);
  }

  async handleRedisMessage(message: string) {
    console.log(`Received Redis message in channel '${channel}': ${message}`);
    console.log('this works');
    const data = JSON.parse(message);
    this.server.emit('schoolCreated', {
      message: 'worked',
      content: data,
    });
  }
  private subscribeToSchoolCreated() {
    const redis = new RedisService(); // You might need to change this instantiation based on your setup
    redis
      .subscribe('schoolCreated')
      .then(() => {
        console.log('Subscribed to schoolCreated channel');
      })
      .catch((err) => {
        console.error('Error subscribing to schoolCreated channel');
        console.error(err);
      });
  }
}
