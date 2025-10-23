export declare class CreateAirlineDiscountDto {
    airline: string;
    discount_percent?: number;
    fix_discount?: number;
    travel_date: string;
    booking_date: string;
    currency: string;
    from_list?: string[];
    to_list?: string[];
    rbd?: string[];
    source?: string[];
}
declare const UpdateAirlineDiscountDto_base: import("@nestjs/common").Type<Partial<CreateAirlineDiscountDto>>;
export declare class UpdateAirlineDiscountDto extends UpdateAirlineDiscountDto_base {
}
export {};
