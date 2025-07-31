export declare class GroupFareModel {
    id: number;
    GroupId: string;
    Carrier: string;
    PNR: string;
    DepFrom: string;
    ArrTo: string;
    DepDate: string;
    BaseFare: number;
    Taxes: number;
    Cabinclass: string;
    NetFare: number;
    Refundable: boolean;
    TimeLimit: String;
    Baggage: string;
    seatsAvailable: number;
    mealCode: string;
    cabinCode: string;
    segment: number;
    DepartureFrom: string;
    ArrivalTo: string;
    DepTime: string;
    ArrTime: string;
    FlightNumber: string;
    Duration: number;
    DepartureFrom1: string;
    ArrivalTo1: string;
    DepTime1: string;
    ArrTime1: string;
    FlightNumber1: string;
    Duration1: number;
    Transit: string;
    created_at: Date;
    updated_at: Date;
    uid: string;
}
export declare class GroupFareDto {
}
export declare class GroupFareModelUpdate {
    Carrier: string;
    DepFrom: string;
    ArrTo: string;
    DepDate: string;
    BaseFare: number;
    Taxes: number;
    Cabinclass: string;
    NetFare: number;
    Refundable: boolean;
    TimeLimit: String;
    Baggage: string;
    seatsAvailable: number;
    mealCode: string;
    cabinCode: string;
    DepartureFrom: string;
    ArrivalTo: string;
    DepTime: string;
    ArrTime: string;
    FlightNumber: string;
    DepartureFrom1: string;
    ArrivalTo1: string;
    DepTime1: string;
    ArrTime1: string;
    FlightNumber1: string;
}
export declare class GroupFareSearch {
    depfrom: string;
    arrto: string;
    depdate: string;
}
