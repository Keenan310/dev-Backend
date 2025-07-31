export declare class GroupFareModel {
    id: number;
    GroupId: string;
    TripType: string;
    PNR: string;
    Carrier: string;
    RouteFrom: string;
    RouteTo: string;
    DepDate: string;
    NetFare: number;
    Baggage: string;
    seatsAvailable: string;
    mealCode: string;
    segment: number;
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
    rDepFrom: string;
    rSegment: string;
    rArrTo: string;
    rFlightNo: string;
    rDepTime: string;
    rArrTime: string;
    rDepFrom1: string;
    rArrTo1: string;
    rFlightNo1: string;
    rDepTime1: string;
    rArrTime1: string;
    created_at: string;
    updated_at: string;
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
