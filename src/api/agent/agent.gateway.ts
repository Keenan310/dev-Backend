// src/websockets/app.gateway.ts
import { WebSocketGateway, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AgentService } from './agent.service';

@WebSocketGateway()
export class AppGateway {
  @WebSocketServer() server: Server;

  constructor(
        private readonly agentService: AgentService
    ){}

    @SubscribeMessage('myaccount')
    async myaccountNotify(client: any, agentUId: string): Promise<void> {
        const data = await this.agentService.myaccount(agentUId);
        client.emit('myaccount', data);
    }

    @SubscribeMessage('myaccount')
    async myaccount(client: any, agentUId: string): Promise<void> {
        const data = await this.agentService.myaccount(agentUId);
        client.emit('myaccount', data);
    }
}
