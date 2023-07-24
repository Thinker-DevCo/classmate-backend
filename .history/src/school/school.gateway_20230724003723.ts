import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class SchoolGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log(payload);
  }
}
