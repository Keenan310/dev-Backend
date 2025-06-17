import { GroupfareService } from './groupfare.service';
import { GroupFareModel, GroupFareModelUpdate, GroupFareSearch } from './groupfare.model';
export declare class GroupfareController {
    private readonly groupfareService;
    constructor(groupfareService: GroupfareService);
    create(header: Headers, createGroupfareDto: GroupFareModel): Promise<GroupFareModel>;
    findAllAdmin(header: Headers): Promise<GroupFareModel[] | {
        OfferId: any;
        System: string;
        FarePolicy: string;
        InstantPayment: boolean;
        IssuePermit: string;
        TripType: string;
        FareType: string;
        Carrier: any;
        CarrierName: string;
        Cabinclass: string;
        BaseFare: any;
        Taxes: any;
        NetFare: any;
        GrossFare: any;
        Comission: number;
        TimeLimit: string;
        Refundable: boolean;
        PriceBreakDown: {
            PaxType: string;
            BaseFare: any;
            Taxes: any;
            TotalFare: any;
            PaxCount: number;
            Bag: {
                Airline: any;
                Allowance: any;
            }[];
        }[];
        AllLegsInfo: {
            DepDate: any;
            DepFrom: any;
            ArrTo: any;
            Duration: number;
            Transit: any;
            Segments: any[];
        }[];
    }[]>;
    findAllAgent(header: string): Promise<GroupFareModel[] | {
        OfferId: any;
        System: string;
        FarePolicy: string;
        InstantPayment: boolean;
        IssuePermit: string;
        TripType: string;
        FareType: string;
        Carrier: any;
        CarrierName: string;
        Cabinclass: string;
        BaseFare: any;
        Taxes: any;
        NetFare: any;
        GrossFare: any;
        Comission: number;
        TimeLimit: string;
        Refundable: boolean;
        PriceBreakDown: {
            PaxType: string;
            BaseFare: any;
            Taxes: any;
            TotalFare: any;
            PaxCount: number;
            Bag: {
                Airline: any;
                Allowance: any;
            }[];
        }[];
        AllLegsInfo: {
            DepDate: any;
            DepFrom: any;
            ArrTo: any;
            Duration: number;
            Transit: any;
            Segments: any[];
        }[];
    }[]>;
    findBySearch(header: string, searchGF: GroupFareSearch): Promise<{
        OfferId: any;
        System: string;
        FarePolicy: string;
        InstantPayment: boolean;
        IssuePermit: string;
        TripType: string;
        FareType: string;
        Carrier: any;
        CarrierName: string;
        Cabinclass: string;
        BaseFare: any;
        Taxes: any;
        NetFare: any;
        GrossFare: any;
        Comission: number;
        TimeLimit: string;
        Refundable: boolean;
        PriceBreakDown: {
            PaxType: string;
            BaseFare: any;
            Taxes: any;
            TotalFare: any;
            PaxCount: number;
            Bag: {
                Airline: any;
                Allowance: any;
            }[];
        }[];
        AllLegsInfo: {
            DepDate: any;
            DepFrom: any;
            ArrTo: any;
            Duration: number;
            Transit: any;
            Segments: any[];
        }[];
    }[]>;
    findOneAdmin(header: Headers, uid: string): Promise<GroupFareModel>;
    update(header: Headers, uid: string, updateGroupfareDto: GroupFareModelUpdate): Promise<import("typeorm").UpdateResult>;
    remove(header: Headers, uid: string): Promise<import("typeorm").DeleteResult>;
}
