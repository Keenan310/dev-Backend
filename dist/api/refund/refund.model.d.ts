export declare class RefundModel {
    id: number;
    agentId: string;
    bookingId: string;
    passengerdata: string;
    netfare: number;
    refundpenalty: number;
    servicefee: number;
    quotationamount: number;
    status: string;
    remarks: string;
    created_at: Date;
    updated_at: Date;
    uid: string;
}
export declare class RefundRequestModel {
    text: string;
}
export declare class RefundQuotation {
    refundpenalty: number;
    servicefee: number;
    quotationamount: number;
    remarks: string;
}
export declare class RefundDecisionModel {
    remarks: string;
}
