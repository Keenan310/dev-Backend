import { Module } from '@nestjs/common';
import { TicketingService } from './ticketing.service';
import { TicketingController } from './ticketing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { BookingModel } from '../booking/booking.model';
import { AgentModel } from '../agent/agent.model';
import { AdminModel } from '../admin/admin.model';
import { AgentLedgerModel } from '../report/report.model';
import { StaffModel } from '../staff/staff.model';
import { TicketModel } from './ticketing.model';
import { MailService } from 'src/mail/mail.service';
import { PassengerModel } from '../passenger/passenger.model';
import { AuthUtils } from '../auth/auth.utils';
import { OTPModel } from '../auth/auth.model';
import { ActivitylogService } from '../activitylog/activitylog.service';
import { ActivityLogModel } from '../activitylog/entities/activitylog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AgentModel, PassengerModel, TicketModel, AgentLedgerModel, AdminModel, BookingModel, StaffModel, OTPModel, ActivityLogModel])],
  controllers: [TicketingController],
  providers: [TicketingService, AuthService, JwtService, AuthUtils, MailService, ActivitylogService],
})
export class TicketingModule {}
