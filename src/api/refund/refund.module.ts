import { Module } from '@nestjs/common';
import { RefundService } from './refund.service';
import { RefundController } from './refund.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefundModel } from './refund.model';
import { AgentModel } from '../agent/agent.model';
import { BookingModel } from '../booking/booking.model';
import { AdminModel } from '../admin/admin.model';
import { StaffModel } from '../staff/staff.model';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AgentLedgerModel } from '../report/report.model';
import { MailService } from 'src/mail/mail.service';
import { AuthUtils } from '../auth/auth.utils';
import { OTPModel } from '../auth/auth.model';

@Module({
  imports: [TypeOrmModule.forFeature([RefundModel, AgentModel, BookingModel, AdminModel, AdminModel, StaffModel, AgentLedgerModel, OTPModel])],
  controllers: [RefundController],
  providers: [RefundService, AuthService, AuthUtils, JwtService, MailService],
})
export class RefundModule {}
