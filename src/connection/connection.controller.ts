import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { AtGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators';

@UseGuards(AtGuard)
@Controller({ path: 'connections', version: '1' })
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Post('sendconnection')
  create(
    @GetCurrentUserId() sender_id: string,
    @Body() connection: CreateConnectionDto,
  ) {
    return this.connectionService.sendConnnection(
      sender_id,
      connection.receiver_id,
    );
  }

  @Get('getUserConnections')
  findAll(@GetCurrentUserId() user_id: string) {
    return this.connectionService.getUserConnections(user_id);
  }

  @Patch('acceptconnection')
  update(
    @Query('receiver') receiver_id: string,
    @GetCurrentUserId() user_id: string,
  ) {
    return this.connectionService.acceptConnectionRequest(user_id, receiver_id);
  }

  @Delete('removeconnection')
  remove(
    @GetCurrentUserId() user_id: string,
    @Query('receiver') receiver_id: string,
  ) {
    return this.connectionService.rejectConnection(receiver_id, user_id);
  }
}
