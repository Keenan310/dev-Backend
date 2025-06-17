import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffModel } from './staff.model';
import { AgentModel } from '../agent/agent.model';
import { MailService } from 'src/mail/mail.service';
import { BookingModel } from '../booking/booking.model';
import { AdminModel } from '../admin/admin.model';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthUtils } from '../auth/auth.utils';
import { OTPModel } from '../auth/auth.model';

@Module({
  imports: [TypeOrmModule.forFeature([StaffModel, BookingModel , AdminModel, AgentModel, OTPModel])],
  controllers: [StaffController],
  providers: [StaffService, MailService, AuthService, AuthUtils, JwtService],
})
export class StaffModule {}
