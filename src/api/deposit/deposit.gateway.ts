// src/websockets/app.gateway.ts
import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { DepositService } from './deposit.service';

@WebSocketGateway()
export class AppGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly depositService: DepositService) {}

  @SubscribeMessage('fetchAllDepositByAgent')
  async fetchAllDepositByAgent(client: any, agentUId: string): Promise<void> {
    //const data = await this.depositService.findAllAgent(agentUId);
    //client.emit('fetchAllDepositByAgent', data);
  }
}
