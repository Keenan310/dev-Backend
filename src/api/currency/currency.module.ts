import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyConverter } from './entities/currency.entity';
import { AuthService } from '../auth/auth.service';
import { AgentModel } from '../agent/agent.model';
import { StaffModel } from '../staff/staff.model';
import { AdminModel } from '../admin/admin.model';
import { OTPModel } from '../auth/auth.model';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { AuthUtils } from '../auth/auth.utils';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyConverter, AgentModel, StaffModel, AdminModel, OTPModel])],
  controllers: [CurrencyController],
  providers: [CurrencyService, AuthService, JwtService, MailService, AuthUtils],
})
export class CurrencyModule {}
