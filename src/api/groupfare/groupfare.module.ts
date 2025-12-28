import { Module } from '@nestjs/common';
import { GroupfareService } from './groupfare.service';
import { GroupfareController } from './groupfare.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupFareModel } from './groupfare.model';
import { AuthService } from '../auth/auth.service';
import { AgentModel } from '../agent/agent.model';
import { StaffModel } from '../staff/staff.model';
import { AdminModel } from '../admin/admin.model';
import { JwtService } from '@nestjs/jwt';
import { AirlinesService } from '../airlines/airlines.service';
import { AirlineDiscount, AirlineDiscountForAgent, AirlinesModel } from '../airlines/airlines.model';
import { AirportsModel } from '../airports/airports.model';
import { AirportsService } from '../airports/airports.service';
import { MailService } from 'src/mail/mail.service';
import { BookingModel } from '../booking/booking.model';
import { AuthUtils } from '../auth/auth.utils';
import { OTPModel } from '../auth/auth.model';
import { CurrencyConverter } from '../currency/entities/currency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AirlineDiscount,AirlineDiscountForAgent, GroupFareModel, BookingModel, AgentModel, StaffModel, AdminModel, AirlinesModel, AirportsModel, OTPModel, CurrencyConverter])],
  controllers: [GroupfareController],
  providers: [GroupfareService, AuthService, JwtService, AuthUtils, AirlinesService, AirportsService, MailService],
})
export class GroupfareModule {}
