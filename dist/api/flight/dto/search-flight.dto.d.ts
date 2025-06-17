declare class SegmentDto {
    depfrom: string;
    arrto: string;
    depdate: Date;
}
export declare class FlightSearchModel {
    adultcount: number;
    childcount: number;
    infantcount: number;
    connection: string;
    cabinclass: string;
    segments: SegmentDto[];
}
export {};
