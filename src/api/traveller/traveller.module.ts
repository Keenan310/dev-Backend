import { Module } from '@nestjs/common';
import { TravellerService } from './traveller.service';
import { TravellerController } from './traveller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravellerModel } from './traveller.model';
import { AgentModel } from '../agent/agent.model';
import { AuthService } from '../auth/auth.service';
import { StaffModel } from '../staff/staff.model';
import { BookingModel } from '../booking/booking.model';
import { AdminModel } from '../admin/admin.model';
import { OTPModel } from '../auth/auth.model';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { AuthUtils } from '../auth/auth.utils';

@Module({
  imports: [TypeOrmModule.forFeature([TravellerModel, AgentModel, StaffModel, BookingModel, AdminModel, OTPModel])],
  controllers: [TravellerController],
  providers: [TravellerService, AuthService, JwtService, MailService, AuthUtils],
})
export class TravellerModule {}
