export declare class DepositModel {
    id: number;
    agentId: string;
    depositId: string;
    amount: number;
    sender: string;
    receiver: string;
    paymentway: string;
    paymentId: string;
    trxId: string;
    status: string;
    ref: string;
    remarks: string;
    companyname: string;
    attachment: string;
    created_at: Date;
    updated_at: Date;
    uid: string;
}
export declare class DepositModelUpdate {
    amount: number;
    sender: string;
    receiver: string;
    paymentway: string;
    status: string;
    ref: string;
    remarks: string;
}
export declare class DepositModelUpdateStatus {
    status: string;
    remarks: string;
}
export declare class DepositBonuseModel {
    bonus: number;
    refId: string;
}
