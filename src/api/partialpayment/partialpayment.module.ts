import { Module } from '@nestjs/common';
import { PartialpaymentService } from './partialpayment.service';
import { PartialpaymentController } from './partialpayment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartialPaymentModel } from './entities/partialpayment.entity';
import { AuthService } from '../auth/auth.service';
import { AgentModel } from '../agent/agent.model';
import { BookingModel } from '../booking/booking.model';
import { StaffModel } from '../staff/staff.model';
import { AdminModel } from '../admin/admin.model';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { AuthUtils } from '../auth/auth.utils';
import { OTPModel } from '../auth/auth.model';
import { AgentLedgerModel } from '../report/report.model';

@Module({
  imports: [TypeOrmModule.forFeature([PartialPaymentModel, AgentModel, BookingModel, StaffModel, AdminModel, OTPModel, AgentLedgerModel])],
  controllers: [PartialpaymentController],
  providers: [PartialpaymentService, AuthService, AuthUtils, JwtService, MailService],
})
export class PartialpaymentModule {}
