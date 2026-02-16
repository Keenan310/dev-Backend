import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { BookingModel } from './booking.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { AgentModel } from '../agent/agent.model';
import { StaffModel } from '../staff/staff.model';
import { AdminModel } from '../admin/admin.model';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { PassengerModel } from '../passenger/passenger.model';
import { PassengerService } from '../passenger/passenger.service';
import { AgentLedgerModel } from '../report/report.model';
import { GroupFareModel } from '../groupfare/groupfare.model';
import { TravellerService } from '../traveller/traveller.service';
import { TravellerModel } from '../traveller/traveller.model';
import { BookingUtils } from './booking.utils';
import { AuthUtils } from '../auth/auth.utils';
import { OTPModel } from '../auth/auth.model';
import { CurrencyConverter } from '../currency/entities/currency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookingModel, TravellerModel, AgentModel, StaffModel,
     AdminModel, PassengerModel, AgentLedgerModel, GroupFareModel, OTPModel, CurrencyConverter])],
  controllers: [BookingController],
  providers: [BookingService, BookingUtils, AuthService, JwtService, MailService, PassengerService, TravellerService, AuthUtils],
})
export class BookingModule {}
