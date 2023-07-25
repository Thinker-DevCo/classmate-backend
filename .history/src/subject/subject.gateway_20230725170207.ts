import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class SubjectGateway {
  @SubscribeMessage('subjectmessage')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
