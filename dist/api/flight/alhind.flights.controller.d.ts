import { Repository } from 'typeorm';
import { PassengerService } from '../passenger/passenger.service';
import { BookingModel } from '../booking/booking.model';
import { BookingService } from '../booking/booking.service';
import { SabreUtils } from './sabre.flight.utils';
import { SearchhistoryService } from '../searchhistory/searchhistory.service';
import { FlightSearchModel } from './dto/search-flight.dto';
import { AgentModel } from '../agent/agent.model';
export declare class AlhindAPI {
    private readonly bookingRepository;
    private readonly passengerService;
    private readonly bookingService;
    private readonly sabreUtils;
    private readonly searchHistoryService;
    constructor(bookingRepository: Repository<BookingModel>, passengerService: PassengerService, bookingService: BookingService, sabreUtils: SabreUtils, searchHistoryService: SearchhistoryService);
    flights(agent: AgentModel, flightDto: FlightSearchModel): Promise<any>;
    flightUtils(result: any, agent: AgentModel, flighDto: FlightSearchModel): Promise<any[]>;
}
