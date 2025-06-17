import { BankListModel } from './banklist.model';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { AgentModel } from '../agent/agent.model';
export declare class BanklistService {
    private readonly banklistRepository;
    private readonly agentRepository;
    private readonly authService;
    constructor(banklistRepository: Repository<BankListModel>, agentRepository: Repository<AgentModel>, authService: AuthService);
    createadmin(header: any, createBanklistDto: BankListModel): Promise<BankListModel>;
    findAllBankList(header: any): Promise<BankListModel[]>;
    findAllByAdmin(header: any): Promise<BankListModel[]>;
    updateadmin(header: any, uid: string, updateBanklistDto: BankListModel): Promise<import("typeorm").UpdateResult>;
    removeadmin(header: any, uid: string): Promise<import("typeorm").DeleteResult>;
    createagent(agentUId: string, createBanklistDto: BankListModel): Promise<BankListModel>;
    findAllByAgent(agentUId: string): Promise<BankListModel[]>;
    updateagent(uid: string, updateBanklistDto: BankListModel): Promise<import("typeorm").UpdateResult>;
    removeagent(uid: string): Promise<import("typeorm").DeleteResult>;
}
