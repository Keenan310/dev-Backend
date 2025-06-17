import { Module } from '@nestjs/common';
import { BanklistService } from './banklist.service';
import { BanklistController } from './banklist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankListModel } from './banklist.model';
import { AdminModel } from '../admin/admin.model';
import { AgentModel } from '../agent/agent.model';
import { StaffModel } from '../staff/staff.model';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { BookingModel } from '../booking/booking.model';
import { AuthUtils } from '../auth/auth.utils';
import { OTPModel } from '../auth/auth.model';

@Module({
  imports: [TypeOrmModule.forFeature([BankListModel, BookingModel, AdminModel, AgentModel, AdminModel, StaffModel, OTPModel])],
  controllers: [BanklistController],
  providers: [BanklistService, AuthService, AuthUtils, JwtService, MailService],
})
export class BanklistModule {}
