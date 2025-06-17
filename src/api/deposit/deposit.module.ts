import { Module } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositModel } from './deposit.model';
import { AgentModel } from '../agent/agent.model';
import { AuthService } from '../auth/auth.service';
import { StaffModel } from '../staff/staff.model';
import { AdminModel } from '../admin/admin.model';
import { JwtService } from '@nestjs/jwt';
import { AgentLedgerModel } from '../report/report.model';
import { MailService } from 'src/mail/mail.service';
import { BookingModel } from '../booking/booking.model';
import { AuthUtils } from '../auth/auth.utils';
import { OTPModel } from '../auth/auth.model';

@Module({
  imports: [TypeOrmModule.forFeature([DepositModel, AgentModel, BookingModel, StaffModel, AdminModel, AgentLedgerModel, OTPModel])],
  controllers: [DepositController],
  providers: [DepositService, AuthService, JwtService, AuthUtils, MailService],
})
export class DepositModule {}
