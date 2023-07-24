import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
@WebSocketGateway()
export class SchoolGateway implements OnGatewayConnection {
  handleConnection(client: Socket, ...args: any[]) {
    console.log(client.id);
  }
  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: any) {
    console.log(body);
  }
}
