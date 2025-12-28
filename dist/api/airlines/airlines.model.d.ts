export declare class AirlinesModel {
    id: number;
    iata: string;
    soto: number;
    soti: number;
    sito: number;
    domestic: number;
    addAmount: number;
    instantPayment: boolean;
    issuePermit: string;
    isBlocked: boolean;
    bookable: boolean;
    docs: string;
    icao: string;
    marketing_name: string;
    full_name: string;
    status: string;
    type: string;
    alliance: string;
    ffpName: string;
    lowCost: string;
    countryName: string;
    founded: string;
    baggageUrl: string;
    website: string;
    webCheckinUrl: string;
    mobileCheckinUrl: string;
    logo: string;
    createdAt: string;
    updatedAt: string;
    uid: string;
}
export declare class AirlinesUpdateModel {
    soto: number;
    soti: number;
    sito: number;
    domestic: number;
    addAmount: number;
    instantPayment: boolean;
    issuePermit: string;
    isBlocked: boolean;
    bookable: boolean;
}
export declare class AirlineDiscount {
    id: number;
    airline: string;
    discount_percent: number;
    fix_discount: number;
    travel_date: string;
    booking_date: string;
    currency: string;
    from_list: string[];
    to_list: string[];
    rbd: string[];
    source: string[];
    created_at: Date;
    update_at: Date;
}
export declare class AirlineDiscountForAgent {
    id: number;
    agentId: string;
    airline: string;
    discount_percent: number;
    fix_discount: number;
    travel_date: string;
    booking_date: string;
    from_list: string[];
    to_list: string[];
    rbd: string[];
    source: string[];
    created_at: Date;
    update_at: Date;
}
