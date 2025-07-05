import { BookingService } from './booking.service';
import { BookingModelUpdateAdmin } from './booking.model';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    findAllAdmin(header: Headers, page?: number, status?: string, filter?: string, limit?: number): Promise<{
        limit: number;
        page: number;
        totalpage: number;
        totaldata: number;
        data: import("./booking.model").BookingModel[];
    }>;
    findOneAgentByAdmin(header: Headers, agentUId?: string, page?: number, status?: string, filter?: string, limit?: number): Promise<{
        limit: number;
        page: number;
        totalpage: number;
        totaldata: number;
        data: import("./booking.model").BookingModel[];
    }>;
    findAllAgent(header?: string, page?: number, status?: string, filter?: string, limit?: number): Promise<{
        limit: number;
        page: number;
        totalpage: number;
        totaldata: number;
        data: import("./booking.model").BookingModel[];
    }>;
    findOneAgent(header: string, bookingUId: string): Promise<import("./booking.model").BookingModel>;
    findOneBookingAdmin(header: Headers, bookingUId: string): Promise<import("./booking.model").BookingModel>;
    findPastFlightAgentId(header: string): Promise<any>;
    findUpcomingFlightAgentId(header: string): Promise<import("./booking.model").BookingModel[]>;
    findCalendareByAgentId(header: string, yearMonth: Date): Promise<any[]>;
    update(header: Headers, bookingUId: string, updateBookingDto: BookingModelUpdateAdmin): Promise<import("typeorm").UpdateResult>;
    remove(header: Headers, bookingUId: string): Promise<import("typeorm").DeleteResult>;
}
