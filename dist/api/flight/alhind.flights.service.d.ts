import { Repository } from 'typeorm';
import { PassengerService } from '../passenger/passenger.service';
import { BookingModel } from '../booking/booking.model';
import { BookingService } from '../booking/booking.service';
import { SearchhistoryService } from '../searchhistory/searchhistory.service';
import { FlightSearchModel } from './dto/search-flight.dto';
import { AgentModel } from '../agent/agent.model';
import { AirlinesService } from '../airlines/airlines.service';
import { AirportsService } from '../airports/airports.service';
import { Revalidation } from './dto/revalidation-flight.dto';
import { CurrencyConverter } from '../currency/entities/currency.entity';
export declare class AlhindAPI {
    private readonly bookingRepository;
    private readonly currencyConverterRepository;
    private readonly passengerService;
    private readonly bookingService;
    private readonly searchHistoryService;
    private readonly airlinesService;
    private readonly airportsService;
    constructor(bookingRepository: Repository<BookingModel>, currencyConverterRepository: Repository<CurrencyConverter>, passengerService: PassengerService, bookingService: BookingService, searchHistoryService: SearchhistoryService, airlinesService: AirlinesService, airportsService: AirportsService);
    flights(agent: AgentModel, flightDto: FlightSearchModel): Promise<any[]>;
    flightUtils(result: any, agentdata: AgentModel, flighDto: FlightSearchModel): Promise<any[]>;
    priceCheck(agent: AgentModel, revalidation: Revalidation): Promise<Revalidation>;
    getAirports(code: string): Promise<{
        code: string;
        name: string;
        location: string;
    } | {
        code: string;
        name: string;
        location: Location;
    }>;
    getAirlineName(code: string): Promise<string>;
}
