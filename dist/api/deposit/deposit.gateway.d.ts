import { Server } from 'socket.io';
import { DepositService } from './deposit.service';
export declare class AppGateway {
    private readonly depositService;
    server: Server;
    constructor(depositService: DepositService);
    fetchAllDepositByAgent(client: any, agentUId: string): Promise<void>;
}
