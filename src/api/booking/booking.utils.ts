import { Injectable } from '@nestjs/common';
import * as dotenv from "dotenv";
import { AgentModel } from '../agent/agent.model';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingModel } from './booking.model';
import { Repository } from 'typeorm';
import { ActivitylogService } from '../activitylog/activitylog.service';
import { agent } from 'supertest';
dotenv.config()

@Injectable()
export class BookingUtils {
    constructor(
        @InjectRepository(BookingModel)
        private readonly bookingRepository: Repository<BookingModel>,
        private readonly activityLogService: ActivitylogService){}

    async bookingParser(agentdata: AgentModel, responseData: any,  bookingDto: any, priceCheck: any){

        const agentId : string = agentdata.agentId;
        const email : string = bookingDto.ContactInfo.email || "dev@flyjatt.com";
        const phone : string = bookingDto.ContactInfo.phone || "08801685370455";
        const name : string = bookingDto.PassengerInfo.adult[0].givenname +" " + bookingDto.PassengerInfo.adult[0].surname;
        const adult : number = (bookingDto.PassengerInfo.adult).length;
        const child : number = (bookingDto.PassengerInfo.child).length || 0;
        const infant : number = (bookingDto.PassengerInfo.infant).length || 0;
        const paxCount  : number = adult + child + infant;

        const booking = await this.bookingRepository.find({order: { id: 'DESC' }, take : 1});
  
        let bookingId='POB1000';
        if(booking.length == 1){
            let old_booking_id = (booking[0].bookingId).replace("POB",'');
            bookingId = "POB" + (parseInt(old_booking_id) + 1);
        }

        let PNR : string = responseData?.CreatePassengerNameRecordRS?.ItineraryRef?.ID || await this.generatePNR();
        let airlinesPnr : string = await this.generateAirlinesPNR();
        let system : string = responseData?.CreatePassengerNameRecordRS?.ItineraryRef?.ID
                             ? priceCheck?.System : 'Portal';

        let totalsegments : number = 0;
        for (let sgFlight of priceCheck.AllLegsInfo) {
            for (let flight of sgFlight.Segments) {
                totalsegments++;
            }
        }
        const bookingData = {
            agentId: agentId,
            bookingId: bookingId,
            system: system,
            carrier_name: priceCheck.CarrierName,
            carrier_code: priceCheck.Carrier,
            depfrom: bookingDto.FlightInfo.AllLegsInfo[0].DepFrom,
            pnr: PNR,
            airlinespnr: airlinesPnr,
            refundable: priceCheck.Refundable,
            instant_payment: priceCheck.InstantPayment,
            issue_permit: priceCheck.IssuePermit,
            arrto: bookingDto.FlightInfo.AllLegsInfo[0].ArrTo,
            triptype: bookingDto.FlightInfo.TripType,
            netfare: bookingDto.FlightInfo.NetFare,
            grossfare: bookingDto.FlightInfo.GrossFare,
            comission: bookingDto.FlightInfo.Comission,
            status: "Hold",
            name: name,
            email: email,
            phone: phone,
            adultcount: adult,
            childcount: child,
            infantcount: infant,
            totalpax: paxCount,
            flightdata: null,
            totalsegment: totalsegments,
            itenary: bookingDto.FlightInfo,
            timelimit: priceCheck.TimeLimit || 'N/F',
            flightdate: priceCheck.AllLegsInfo[0].DepDate,
            companyname: agentdata.company
        }

        const activityLog = {agentId: agentId, status: 'Hold', platform: 'B2B',
        refId: bookingId, module: 'Booking', action_by: agent.name};

        await this.activityLogService.create(activityLog);

        return bookingData
    }

    async generatePNR() {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let randomString = '';
    
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            randomString += charset[randomIndex];
        }
    
        return randomString;
    }

    async generateAirlinesPNR() {
        const charset = 'A0B1C2D3E4F5G6H7I8J9KLMNOPQRSTUVWXYZ';
        let randomString = '';
    
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            randomString += charset[randomIndex];
        }
    
        return randomString;
    }
    
}