import {
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway()
export class SubjectGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  afterInit(server: any) {
    throw new Error('Method not implemented.');
  }
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  @SubscribeMessage('subjectmessage')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
