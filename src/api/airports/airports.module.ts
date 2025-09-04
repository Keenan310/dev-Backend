import { Module } from '@nestjs/common';
import { AirportsService } from './airports.service';
import { AirportsController } from './airports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportsModel } from './airports.model';
import { MailService } from 'src/mail/mail.service';
import { BookingModel } from '../booking/booking.model';
import { AgentModel } from '../agent/agent.model';
import { AuthService } from '../auth/auth.service';
import { StaffModel } from '../staff/staff.model';
import { AdminModel } from '../admin/admin.model';
import { OTPModel } from '../auth/auth.model';
import { JwtService } from '@nestjs/jwt';
import { AuthUtils } from '../auth/auth.utils';

@Module({
  imports: [TypeOrmModule.forFeature([AirportsModel, AgentModel, BookingModel, StaffModel, AdminModel, OTPModel])],
  controllers: [AirportsController],
  providers: [AirportsService, MailService, AuthService, JwtService, AuthUtils],
})
export class AirportsModule {}
