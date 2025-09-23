import { Module } from '@nestjs/common';
import { FlightService } from './flight.service';
import { SabreService } from './sabre.flights.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlinesModel } from '../airlines/airlines.model';
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
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { CHScraper } from './chtravel.flights.service';
import { VoidModel } from '../void/void.model';

@Module({
  imports: [CacheModule.register({
      ttl: 5, // seconds
      max: 100,
      isGlobal: true,  // 👈 very important
    }),
    TypeOrmModule.forFeature(
    [AirlinesModel,SearchHistoryModel, GroupFareModel, TravellerModel,TicketModel, AirportsModel,
    BookingModel, PassengerModel, AgentModel, StaffModel, AdminModel,RefundModel, ReissueModel, VoidModel,
    AgentLedgerModel, OTPModel, ActivityLogModel, CurrencyConverter])],
  controllers: [PreFlightController, PostFlightController],
  providers: [{
          provide: APP_INTERCEPTOR,
          useClass: CacheInterceptor,
        },
        FlightService, TravellerService , GroupfareService, SabreService, AirlinesService, BookingUtils,
    MailService, AirportsService, BookingService , PassengerService, AuthService, JwtService, SabreUtils,
    SearchhistoryService, AuthUtils, ActivitylogService, AlhindAPI, CHScraper]
})
export class FlightModule {}
