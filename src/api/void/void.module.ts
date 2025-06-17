import { Module } from '@nestjs/common';
import { VoidService } from './void.service';
import { VoidController } from './void.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoidModel } from './void.model';
import { BookingModel } from '../booking/booking.model';
import { AgentModel } from '../agent/agent.model';
import { AuthService } from '../auth/auth.service';
import { AgentLedgerModel } from '../report/report.model';
import { AdminModel } from '../admin/admin.model';
import { StaffModel } from '../staff/staff.model';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { AuthUtils } from '../auth/auth.utils';
import { OTPModel } from '../auth/auth.model';

@Module({
  imports: [TypeOrmModule.forFeature([VoidModel, AgentModel, BookingModel, AdminModel, StaffModel, AgentLedgerModel, OTPModel])],
  controllers: [VoidController],
  providers: [VoidService, AuthService, JwtService, AuthUtils, MailService],
})
export class VoidModule {}
