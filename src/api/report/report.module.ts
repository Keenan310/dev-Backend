import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminExpenseModel, AdminLedger, AgentLedgerModel } from './report.model';
import { AgentModel } from '../agent/agent.model';
import { StaffModel } from '../staff/staff.model';
import { AdminModel } from '../admin/admin.model';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { BookingModel } from '../booking/booking.model';
import { DepositModel } from '../deposit/deposit.model';
import { MailService } from 'src/mail/mail.service';
import { SearchHistoryModel } from '../searchhistory/searchhistory.model';
import { AuthUtils } from '../auth/auth.utils';
import { OTPModel } from '../auth/auth.model';

@Module({
  imports: [TypeOrmModule.forFeature([AgentLedgerModel, AgentModel, StaffModel, AdminModel, BookingModel, DepositModel, SearchHistoryModel, OTPModel, AdminExpenseModel, AdminLedger])],
  controllers: [ReportController],
  providers: [ReportService, AuthService, JwtService , AuthUtils, MailService],
})
export class ReportModule {}
