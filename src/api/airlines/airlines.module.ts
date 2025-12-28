import { Module } from '@nestjs/common';
import { AirlinesService } from './airlines.service';
import { AirlinesController } from './airlines.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineDiscount, AirlinesModel, AirlineDiscountForAgent } from './airlines.model';
import { JwtService } from '@nestjs/jwt';
import { AgentModel } from '../agent/agent.model';
import { AdminModel } from '../admin/admin.model';
import { StaffModel } from '../staff/staff.model';
import { AuthService } from '../auth/auth.service';
import { MailService } from 'src/mail/mail.service';
import { BookingModel } from '../booking/booking.model';
import { AuthUtils } from '../auth/auth.utils';
import { OTPModel } from '../auth/auth.model';

@Module({
  imports: [TypeOrmModule.forFeature([AirlinesModel, AirlineDiscount, AirlineDiscountForAgent, BookingModel, AgentModel, AdminModel, StaffModel, OTPModel])],
  controllers: [AirlinesController],
  providers: [AirlinesService, JwtService, AuthService, AuthUtils, MailService],
})
export class AirlinesModule {}
