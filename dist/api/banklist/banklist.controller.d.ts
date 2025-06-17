import { BanklistService } from './banklist.service';
import { BankListModel } from './banklist.model';
export declare class BanklistController {
    private readonly banklistService;
    constructor(banklistService: BanklistService);
    admincreate(header: Headers, createBanklistDto: BankListModel): Promise<BankListModel>;
    findAllBankList(header: string): Promise<BankListModel[]>;
    findAllByAdmin(header: Headers): Promise<BankListModel[]>;
    updateadmin(header: Headers, uid: string, updateBanklistDto: BankListModel): Promise<import("typeorm").UpdateResult>;
    removeadmin(header: Headers, uid: string): Promise<import("typeorm").DeleteResult>;
    agentcreate(agentUId: string, createBanklistDto: BankListModel): Promise<BankListModel>;
    findAllByAgent(agentUId: string): Promise<BankListModel[]>;
    updateagent(uid: string, updateBanklistDto: BankListModel): Promise<import("typeorm").UpdateResult>;
    removeagent(uid: string): Promise<import("typeorm").DeleteResult>;
}
