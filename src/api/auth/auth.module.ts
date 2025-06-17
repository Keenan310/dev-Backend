import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentModel } from '../agent/agent.model';
import { AdminModel } from '../admin/admin.model';
import { JwtModule } from '@nestjs/jwt';
import { StaffModel } from '../staff/staff.model';
import { MailService } from 'src/mail/mail.service';
import { BookingModel } from '../booking/booking.model';
import { AuthUtils } from './auth.utils';
import { OTPModel } from './auth.model';
import * as dotenv from "dotenv";
dotenv.config()

@Module({
  imports: [TypeOrmModule.forFeature([AgentModel, AdminModel, StaffModel, BookingModel, OTPModel]),
  JwtModule.register({
      secret: process.env.JWT_SECREATE_KEY,
      signOptions: { expiresIn: '1w' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthUtils, MailService],
})
export class AuthModule {}
