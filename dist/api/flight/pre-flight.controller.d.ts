import { FlightService } from './flight.service';
import { AirBookingModel } from './dto/booking-flight.dto';
import { Revalidation } from './dto/revalidation-flight.dto';
import { FlightSearchModel } from './dto/search-flight.dto';
export declare class PreFlightController {
    private readonly flightService;
    constructor(flightService: FlightService);
    AirSearch(header: string, flightDto: FlightSearchModel): Promise<any>;
    Revalidation(header: string, revalidationDto: Revalidation): Promise<any>;
    AirBooking(header: string, bookingDto: AirBookingModel): Promise<({
        agentId: string;
        bookingId: string;
        system: string;
        carrier_name: any;
        carrier_code: any;
        depfrom: any;
        pnr: string;
        airlinespnr: string;
        refundable: any;
        instant_payment: any;
        issue_permit: any;
        arrto: any;
        triptype: any;
        netfare: any;
        grossfare: any;
        comission: any;
        status: string;
        name: string;
        email: string;
        phone: string;
        adultcount: number;
        childcount: number;
        infantcount: number;
        totalpax: number;
        flightdata: any;
        totalsegment: number;
        itenary: any;
        timelimit: any;
        flightdate: any;
        companyname: string;
    } & import("../booking/booking.model").BookingModel) | {
        status: string;
        error: any;
        message: string;
    } | ({
        agentId: string;
        bookingId: string;
        system: any;
        carrier_name: any;
        carrier_code: any;
        depfrom: any;
        pnr: string;
        refundable: any;
        arrto: any;
        triptype: any;
        netfare: number;
        grossfare: number;
        status: string;
        name: string;
        email: string;
        phone: string;
        adultcount: number;
        childcount: number;
        infantcount: number;
        totalpax: number;
        flightdata: any;
        itenary: AirBookingModel;
        totalsegment: number;
        timelimit: any;
        flightdate: any;
        companyname: string;
    } & import("../booking/booking.model").BookingModel) | "Invalid System">;
    AirRetrieveAgent(header: string, bookingUId: string): Promise<{
        bookingdata: import("../booking/booking.model").BookingModel;
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
    AirRetrieveAdmin(header: Headers, bookingUId: string): Promise<{
        bookingdata: import("../booking/booking.model").BookingModel;
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
