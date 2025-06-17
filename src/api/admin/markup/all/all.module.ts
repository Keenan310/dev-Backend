import { Module } from '@nestjs/common';
import { AllService } from './all.service';
import { AllController } from './all.controller';

@Module({
  controllers: [AllController],
  providers: [AllService],
})
export class AllModule {}
