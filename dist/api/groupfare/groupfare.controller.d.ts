import { GroupfareService } from './groupfare.service';
import { GroupFareDto, GroupFareModel } from './groupfare.model';
export declare class GroupfareController {
    private readonly groupfareService;
    constructor(groupfareService: GroupfareService);
    create(header: Headers, groupFare: GroupFareDto): Promise<any>;
    findAllAdmin(header: Headers): Promise<(any[] | {
        OfferId: any;
        System: string;
        TripType: string;
        Carrier: any;
        CarrierName: string;
        Cabinclass: string;
        BaseFare: number;
        Taxes: number;
        NetFare: number;
        GrossFare: number;
        Comission: number;
        Currency: string;
        TimeLimit: string;
        Refundable: boolean;
        PriceBreakDown: {
            PaxType: string;
            BaseFare: number;
            Taxes: number;
            TotalFare: number;
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
    findAllAdminSpecialFare(header: Headers, triptype: string): Promise<any[]>;
    findAllAdminSpecialFareAll(header: Headers, triptype: string, origin: string, destination: string): Promise<any[]>;
    findAllAgent(header: string): Promise<GroupFareModel[] | (any[] | {
        OfferId: any;
        System: string;
        TripType: string;
        Carrier: any;
        CarrierName: string;
        Cabinclass: string;
        BaseFare: number;
        Taxes: number;
        NetFare: number;
        GrossFare: number;
        Comission: number;
        Currency: string;
        TimeLimit: string;
        Refundable: boolean;
        PriceBreakDown: {
            PaxType: string;
            BaseFare: number;
            Taxes: number;
            TotalFare: number;
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
    remove(header: Headers, uid: string): Promise<import("typeorm").DeleteResult>;
}
