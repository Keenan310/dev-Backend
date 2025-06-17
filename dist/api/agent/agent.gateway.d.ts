import { Server } from 'socket.io';
import { AgentService } from './agent.service';
export declare class AppGateway {
    private readonly agentService;
    server: Server;
    constructor(agentService: AgentService);
    myaccountNotify(client: any, agentUId: string): Promise<void>;
    myaccount(client: any, agentUId: string): Promise<void>;
}
