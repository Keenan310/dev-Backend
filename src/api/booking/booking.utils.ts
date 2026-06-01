import { Injectable } from '@nestjs/common';
import * as dotenv from "dotenv";
import { AgentModel } from '../agent/agent.model';
import { InjectRepository } from '@nestjs/typeorm';
import { BookingModel } from './booking.model';
import { Repository } from 'typeorm';
dotenv.config()

@Injectable()
export class BookingUtils {
    constructor(
        @InjectRepository(BookingModel)
        private readonly bookingRepository: Repository<BookingModel>){}

    async bookingParser(agentdata: AgentModel, responseData: any,  bookingDto: any){

        const agentId : string = agentdata.agentId;
        const email : string = bookingDto?.ContactInfo?.email || "dev@flyjatt.com";
        const phone : string = bookingDto?.ContactInfo?.phone || "08801685370455";
        const name : string = bookingDto?.PassengerInfo?.adult?.[0]?.givenname +" " + bookingDto?.PassengerInfo?.adult?.[0]?.surname;
        const adult : number = (bookingDto?.PassengerInfo?.adult).length;
        const child : number = (bookingDto?.PassengerInfo?.child).length || 0;
        const infant : number = (bookingDto?.PassengerInfo?.infant).length || 0;
        const paxCount  : number = adult + child + infant;

        const booking = await this.bookingRepository.find({order: { id: 'DESC' }, take : 1});
  
        let bookingId='KTB1000';
        if(booking.length == 1){
            let old_booking_id = (booking[0].bookingId).replace("KTB",'');
            bookingId = "KTB" + (parseInt(old_booking_id) + 1);
        }

        let PNR : string = responseData?.bookingId || await this.generatePNR();
        let airlinesPnr : string = responseData?.flights?.[0]?.confirmationId || await this.generateAirlinesPNR();
        let systems : string = bookingDto?.FlightInfo?.System;

        let totalsegments : number = 0;
        for (let sgFlight of bookingDto?.FlightInfo?.AllLegsInfo) {
            for (let flight of sgFlight.Segments) {
                totalsegments++;
            }
        }
        const bookingData = {
            agentId: agentId,
            bookingId: bookingId,
            system: systems,
            carrier_name: bookingDto?.FlightInfo?.CarrierName,
            carrier_code: bookingDto?.FlightInfo?.Carrier,
            depfrom: bookingDto?.FlightInfo?.AllLegsInfo?.[0]?.DepFrom,
            pnr: PNR,
            airlinespnr: airlinesPnr,
            refundable: bookingDto?.FlightInfo?.Refundable,
            arrto: bookingDto?.FlightInfo?.AllLegsInfo?.[0]?.ArrTo,
            triptype: bookingDto?.FlightInfo?.TripType,
            netfare: bookingDto?.FlightInfo?.NetFare,
            grossfare: bookingDto?.FlightInfo?.GrossFare,
            comission: bookingDto?.FlightInfo?.Comission,
            status: "Hold",
            name: name,
            email: email,
            phone: phone,
            adultcount: adult,
            childcount: child,
            infantcount: infant,
            totalpax: paxCount,
            flightdata: responseData,
            totalsegment: totalsegments,
            itenary: bookingDto?.FlightInfo,
            timelimit: bookingDto?.FlightInfo?.TimeLimit || 'N/F',
            flightdate: bookingDto?.FlightInfo?.AllLegsInfo?.[0]?.DepDate,
            companyname: agentdata?.company
        }

        return bookingData;
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