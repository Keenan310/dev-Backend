export declare class TicketModel {
    id: number;
    agentId: string;
    bookingId: string;
    vendor: string;
    system: string;
    airlines: string;
    bookingpnr: string;
    airlinespnr: string;
    givenname: string;
    surname: string;
    ticketnumber: string;
    issuetype: string;
    created_at: Date;
    updated_at: Date;
    uid: string;
}
export declare class passengerModel {
    givenname: string;
    surname: string;
    ticketnumber: number;
}
export declare class MakeTicketModel {
    vendor: string;
    system: string;
    bookingpnr: string;
    airlinespnr: string;
    issuetype: string;
    purchaseprice: number;
    sellprice: number;
    passengerInfo: passengerModel[];
}
