export declare class AgentLedgerModel {
    id: number;
    agentId: string;
    trxtype: string;
    debit: number;
    credit: number;
    refId: string;
    details: string;
    remarks: string;
    companyname: string;
    ticketcost: number;
    netfare: number;
    pnr: string;
    created_at: Date;
    updated_at: Date;
    uid: string;
}
export declare class AgentLedgerDto {
    trxtype: string;
    debit: number;
    credit: number;
    refId: string;
    details: string;
    remarks: string;
    ticketcost: number;
    netfare: number;
    pnr: string;
}
declare const UpdateAgentLedgerDto_base: import("@nestjs/common").Type<Partial<AgentLedgerDto>>;
export declare class UpdateAgentLedgerDto extends UpdateAgentLedgerDto_base {
}
export declare class AdminLedger {
    id: number;
    description: string;
    pnr: string;
    ticketprice: number;
    supplier: string;
    agentcode: string;
    netfare: number;
    depositAmount: number;
    status: string;
    liable: string;
    created_at: Date;
    updated_at: Date;
}
declare const UpdateAdminLedgerDto_base: import("@nestjs/common").Type<Partial<AdminLedger>>;
export declare class UpdateAdminLedgerDto extends UpdateAdminLedgerDto_base {
}
export declare class AdminExpenseModel {
    id: number;
    details: string;
    amount: number;
    created_at: Date;
    updated_at: Date;
    uid: string;
}
declare const UpdateAdminExpenseDto_base: import("@nestjs/common").Type<Partial<AdminExpenseModel>>;
export declare class UpdateAdminExpenseDto extends UpdateAdminExpenseDto_base {
}
export {};
