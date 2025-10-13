export declare class CreateAirlineDiscountDto {
    airline: string;
    from_location: string;
    discount_percent?: number;
    fix_discount?: number;
    travel_date: string;
    booking_date: string;
    from_list?: string;
    from_except?: string;
    to_list?: string;
    to_except?: string;
    rbd?: string;
    source?: string;
}
declare const UpdateAirlineDiscountDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateAirlineDiscountDto>>;
export declare class UpdateAirlineDiscountDto extends UpdateAirlineDiscountDto_base {
}
export {};
