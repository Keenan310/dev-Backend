import { Module } from '@nestjs/common';
import { ReissueService } from './reissue.service';
import { ReissueController } from './reissue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentModel } from '../agent/agent.model';
import { ReissueModel } from './reissue.model';
import { AdminModel } from '../admin/admin.model';
import { BookingModel } from '../booking/booking.model';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { StaffModel } from '../staff/staff.model';
import { AgentLedgerModel } from '../report/report.model';
import { MailService } from 'src/mail/mail.service';
import { AuthModule } from '../auth/auth.module';
import { AuthUtils } from '../auth/auth.utils';
import { OTPModel } from '../auth/auth.model';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([AgentModel,ReissueModel, AgentLedgerModel, AdminModel, BookingModel, StaffModel, OTPModel])],
  controllers: [ReissueController],
  providers: [ReissueService, AuthService, AuthUtils, JwtService, MailService],
})
export class ReissueModule {}
