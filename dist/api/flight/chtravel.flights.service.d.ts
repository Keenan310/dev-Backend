import { FlightSearchModel } from "./dto/search-flight.dto";
export declare class CHScraper {
    constructor();
    shopping(flightDto: FlightSearchModel): Promise<void>;
}
