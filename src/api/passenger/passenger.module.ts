import { Module } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengerModel } from './passenger.model';
import { AgentModel } from '../agent/agent.model';
import { BookingModel } from '../booking/booking.model';

@Module({
  imports: [TypeOrmModule.forFeature([PassengerModel, BookingModel, AgentModel])],
  controllers: [],
  providers: [PassengerService],
})
export class PassengerModule {}
