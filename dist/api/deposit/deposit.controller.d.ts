import { DepositService } from './deposit.service';
import { DepositBonuseModel, DepositModel, DepositModelUpdate, DepositModelUpdateStatus } from './deposit.model';
export declare class DepositController {
    private readonly depositService;
    constructor(depositService: DepositService);
    findAll(header: Headers, page?: number, status?: string, filter?: string, limit?: number): Promise<{
        limit: number;
        page: number;
        totalpage: number;
        totaldata: number;
        data: DepositModel[];
    }>;
    findAllAgent(header: string, page?: number, status?: string, filter?: string, limit?: number): Promise<{
        limit: number;
        page: number;
        totalpage: number;
        totaldata: number;
        data: DepositModel[];
    }>;
    update(header: Headers, uid: string, updateDepositDto: DepositModelUpdate): Promise<import("typeorm").UpdateResult>;
    updatestatus(header: Headers, uid: string, updateDepositDto: DepositModelUpdateStatus): Promise<import("typeorm").UpdateResult>;
    depositBonus(header: Headers, agentUId: string, depositBonuseModel: DepositBonuseModel): Promise<{
        agentId: string;
        trxtype: string;
        credit: number;
        refId: string;
        details: string;
        companyname: string;
    } & import("../report/report.model").AgentLedgerModel>;
    findAllAgentByAdmin(header: Headers, agentUId: string, page?: number, status?: string, filter?: string, limit?: number): Promise<{
        limit: number;
        page: number;
        totalpage: number;
        totaldata: number;
        data: DepositModel[];
    }>;
}
