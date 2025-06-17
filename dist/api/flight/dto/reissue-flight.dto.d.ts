declare class SegmentDto {
    depfrom: string;
    arrto: string;
    depdate: Date;
}
export declare class ReissueDto {
    system: string;
    ticketNo: number;
    segments: SegmentDto[];
}
export {};
