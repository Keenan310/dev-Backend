import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModel } from './admin.model';
import { StaffModel } from '../staff/staff.model';
import { AgentModel } from '../agent/agent.model';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { BookingModel } from '../booking/booking.model';
import { RoleModule } from './role/role.module';
import { AuthUtils } from '../auth/auth.utils';
import { OTPModel } from '../auth/auth.model';

@Module({
  imports: [TypeOrmModule.forFeature([AdminModel, StaffModel, AgentModel, BookingModel, OTPModel]), RoleModule],
  controllers: [AdminController],
  providers: [AdminService, AuthService, AuthUtils, JwtService, MailService],
})

export class AdminModule {}
