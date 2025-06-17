import { Module } from '@nestjs/common';
import { SearchhistoryService } from './searchhistory.service';
import { SearchhistoryController } from './searchhistory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchHistoryModel } from './searchhistory.model';
import { MailService } from 'src/mail/mail.service';
import { AgentModel } from '../agent/agent.model';
import { BookingModel } from '../booking/booking.model';
import { AuthService } from '../auth/auth.service';
import { StaffModel } from '../staff/staff.model';
import { AdminModel } from '../admin/admin.model';
import { JwtService } from '@nestjs/jwt';
import { AuthUtils } from '../auth/auth.utils';
import { OTPModel } from '../auth/auth.model';

@Module({
  imports: [TypeOrmModule.forFeature([SearchHistoryModel, BookingModel, AgentModel, StaffModel, AdminModel, OTPModel])],
  controllers: [SearchhistoryController],
  providers: [SearchhistoryService, MailService, AuthUtils, AuthService, JwtService],
})
export class SearchhistoryModule {}
