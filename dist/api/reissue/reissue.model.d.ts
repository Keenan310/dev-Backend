export declare class ReissueModel {
    id: string;
    agentId: string;
    bookingId: string;
    passengerdata: string;
    quotationtext: string;
    quotationcopy: string;
    quotationamount: number;
    exchangepenalty: number;
    faredifference: number;
    servicefee: number;
    reissuedate: string;
    remarks: string;
    status: string;
    reissuecopy: string;
    created_at: Date;
    updated_at: Date;
    uid: string;
}
export declare class ReissueRequestModel {
    text: string;
    date: string;
}
export declare class ReissueQuotation {
    quotationamount: number;
    exchangepenalty: number;
    faredifference: number;
    servicefee: number;
    quotationtext: string;
    remarks: string;
}
export declare class ReissueRequestDecision {
    remarks: string;
}
