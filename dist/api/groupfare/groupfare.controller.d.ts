import { GroupfareService } from './groupfare.service';
import { GroupFareDto, GroupFareModel, GroupFareModelUpdate, GroupFareSearch } from './groupfare.model';
export declare class GroupfareController {
    private readonly groupfareService;
    constructor(groupfareService: GroupfareService);
    create(header: Headers, groupFare: GroupFareDto): Promise<any>;
    findAllAdmin(header: Headers): Promise<GroupFareModel[] | (any[] | {
        OfferId: any;
        System: string;
        TripType: string;
        Carrier: any;
        CarrierName: string;
        Cabinclass: string;
        BaseFare: any;
        Taxes: any;
        NetFare: number;
        GrossFare: number;
        Comission: number;
        Currency: string;
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
            Segments: any[];
        }[];
    })[]>;
    findAllAgent(header: string): Promise<GroupFareModel[] | (any[] | {
        OfferId: any;
        System: string;
        TripType: string;
        Carrier: any;
        CarrierName: string;
        Cabinclass: string;
        BaseFare: any;
        Taxes: any;
        NetFare: number;
        GrossFare: number;
        Comission: number;
        Currency: string;
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
            Segments: any[];
        }[];
    })[]>;
    findBySearch(header: string, searchGF: GroupFareSearch): Promise<(any[] | {
        OfferId: any;
        System: string;
        TripType: string;
        Carrier: any;
        CarrierName: string;
        Cabinclass: string;
        BaseFare: any;
        Taxes: any;
        NetFare: number;
        GrossFare: number;
        Comission: number;
        Currency: string;
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
            Segments: any[];
        }[];
    })[]>;
    findOneAdmin(header: Headers, uid: string): Promise<GroupFareModel>;
    update(header: Headers, uid: string, updateGroupfareDto: GroupFareModelUpdate): Promise<import("typeorm").UpdateResult>;
    remove(header: Headers, uid: string): Promise<import("typeorm").DeleteResult>;
}
