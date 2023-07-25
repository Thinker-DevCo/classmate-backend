import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway()
export class SubjectGateway implements OnGatewayInit {
  @SubscribeMessage('subjectmessage')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
