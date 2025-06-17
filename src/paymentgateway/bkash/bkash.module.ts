import { Module } from '@nestjs/common';
import { BkashService } from './bkash.service';
import { BkashController } from './bkash.controller';
import { MailService } from 'src/mail/mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentModel } from 'src/api/agent/agent.model';
import { DepositModel } from 'src/api/deposit/deposit.model';
import { AgentLedgerModel } from 'src/api/report/report.model';
import { BookingModel } from 'src/api/booking/booking.model';

@Module({
  imports: [TypeOrmModule.forFeature([AgentModel, DepositModel, AgentLedgerModel, BookingModel])],
  controllers: [BkashController],
  providers: [BkashService, MailService],
})
export class BkashModule {}
