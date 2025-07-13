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
    pnr: string;
    created_at: Date;
    updated_at: Date;
    uid: string;
}
export declare class AdminExpenseModel {
    id: number;
    details: string;
    amount: number;
    created_at: Date;
    updated_at: Date;
    uid: string;
}
