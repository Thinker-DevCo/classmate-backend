import {
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from 'src/redis/redis.service';
@WebSocketGateway()
export class SubjectGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  constructor(private readonly redis: RedisService) {}
  afterInit(server: any) {
    this.redis.subscribe('subjectCreated', server);
    this.redis.subscribe('subjectUpdated', server);
    this.redis.subscribe('subjectDeleted', server);
  }
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  @SubscribeMessage('subjectmessage')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
