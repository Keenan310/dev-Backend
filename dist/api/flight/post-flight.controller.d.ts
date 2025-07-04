import { FlightService } from './flight.service';
export declare class PostFlightController {
    private readonly flightService;
    constructor(flightService: FlightService);
    AirRetrieveAgent(header: string, bookingUId: string): Promise<{
        bookingdata: any;
        sabredata: any;
        passengerdata: import("../passenger/passenger.model").PassengerModel[];
        refunddata: import("../refund/refund.model").RefundModel;
        reissuedata: import("../reissue/reissue.model").ReissueModel[];
        ticketdetails: import("../booking/booking.model").TicketModel[];
        partialpaymentdata: string;
    } | {
        bookingdata: any;
        sabredata: any[];
        passengerdata: import("../passenger/passenger.model").PassengerModel[];
        refunddata: any[];
        reissuedata: any[];
        ticketdetails: import("../booking/booking.model").TicketModel[];
        partialpaymentdata: {};
    }>;
    AirRetrieveAdmin(header: Headers, bookingUId: string): Promise<{
        bookingdata: import("../booking/booking.model").BookingModel;
        sabredata: any;
        passengerdata: import("../passenger/passenger.model").PassengerModel[];
        refunddata: import("../refund/refund.model").RefundModel;
        reissuedata: import("../reissue/reissue.model").ReissueModel[];
        ticketdetails: import("../booking/booking.model").TicketModel[];
        partialpaymentdata: string;
    } | {
        bookingdata: import("../booking/booking.model").BookingModel;
        sabredata: any[];
        passengerdata: import("../passenger/passenger.model").PassengerModel[];
        refunddata: any[];
        reissuedata: any[];
        ticketdetails: import("../booking/booking.model").TicketModel[];
        partialpaymentdata: {};
    }>;
    AirCheckPNR(header: string, system: string, pnr: string): Promise<any>;
    AirCancelAgent(header: string, bookingUId: string): Promise<{
        status: string;
        message: string;
    }>;
    AirCancelAdmin(header: Headers, bookingUId: string): Promise<{
        status: string;
        message: string;
    }>;
    AirImportPnr(header: string, system: string, pnr: string): Promise<any>;
}
