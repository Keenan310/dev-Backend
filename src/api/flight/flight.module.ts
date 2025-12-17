import { Module } from '@nestjs/common';
import { FlightService } from './flight.service';
import { SabreService } from './sabre.flights.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlinesModel, AirlineDiscount } from '../airlines/airlines.model';
import { AirportsModel } from '../airports/airports.model';
import { BookingService } from '../booking/booking.service';
import { PassengerService } from '../passenger/passenger.service';
import { BookingModel } from '../booking/booking.model';
import { PassengerModel } from '../passenger/passenger.model';
import { AirlinesService } from '../airlines/airlines.service';
import { AirportsService } from '../airports/airports.service';
import { AgentModel } from '../agent/agent.model';
import { AuthService } from '../auth/auth.service';
import { StaffModel } from '../staff/staff.model';
import { AdminModel } from '../admin/admin.model';
import { JwtService } from '@nestjs/jwt';
import { RefundModel } from '../refund/refund.model';
import { ReissueModel } from '../reissue/reissue.model';
import { AgentLedgerModel } from '../report/report.model';
import { TicketModel } from '../ticketing/ticketing.model';
import { MailService } from 'src/mail/mail.service';
import { GroupfareService } from '../groupfare/groupfare.service';
import { GroupFareModel } from '../groupfare/groupfare.model';
import { TravellerService } from '../traveller/traveller.service';
import { TravellerModel } from '../traveller/traveller.model';
import { SearchHistoryModel } from '../searchhistory/searchhistory.model';
import { SabreUtils } from './sabre.flight.utils';
import { SearchhistoryService } from '../searchhistory/searchhistory.service';
import { BookingUtils } from '../booking/booking.utils';
import { AuthUtils } from '../auth/auth.utils';
import { OTPModel } from '../auth/auth.model';
import { PreFlightController } from './pre-flight.controller';
import { PostFlightController } from './post-flight.controller';
import { ActivitylogService } from '../activitylog/activitylog.service';
import { ActivityLogModel } from '../activitylog/entities/activitylog.entity';
import { AlhindAPI } from './alhind.flights.service';
import { CurrencyConverter } from '../currency/entities/currency.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { VoidModel } from '../void/void.model';
import { SaveFlightsData } from './entity/save-flight.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
    [AirlinesModel, AirlineDiscount, SearchHistoryModel, GroupFareModel, TravellerModel,TicketModel, AirportsModel,
    BookingModel, PassengerModel, AgentModel, StaffModel, AdminModel,RefundModel, ReissueModel, VoidModel,
    AgentLedgerModel, OTPModel, ActivityLogModel, CurrencyConverter, SaveFlightsData])],
  controllers: [PreFlightController, PostFlightController],
  providers: [
        FlightService, TravellerService , GroupfareService, SabreService, AirlinesService, BookingUtils,
    MailService, AirportsService, BookingService , PassengerService, AuthService, JwtService, SabreUtils,
    SearchhistoryService, AuthUtils, ActivitylogService, AlhindAPI]
})
export class FlightModule {}
