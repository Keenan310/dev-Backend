import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentCreditModel, AgentModel } from './agent.model';
import { BookingModel } from '../booking/booking.model';
import { DepositModel } from '../deposit/deposit.model';
import { AuthService } from '../auth/auth.service';
import { StaffModel } from '../staff/staff.model';
import { AdminModel } from '../admin/admin.model';
import { JwtService } from '@nestjs/jwt';
import { AgentLedgerModel } from '../report/report.model';
import { MailService } from 'src/mail/mail.service';
import { AuthUtils } from '../auth/auth.utils';
import { OTPModel } from '../auth/auth.model';

@Module({
  imports: [TypeOrmModule.forFeature([AgentModel, AgentCreditModel, BookingModel, DepositModel, StaffModel, AdminModel, AgentLedgerModel, OTPModel])],
  controllers: [AgentController],
  providers: [AgentService, AuthService, AuthUtils, JwtService, MailService],
})
export class AgentModule {}
