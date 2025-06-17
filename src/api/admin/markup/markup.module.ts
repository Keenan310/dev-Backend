import { Module } from '@nestjs/common';
import { AirlinesModule } from './airlines/airlines.module';
import { RouteModule } from './route/route.module';
import { AllModule } from './all/all.module';

@Module({
  imports: [AirlinesModule, RouteModule, AllModule]
})
export class MarkupModule {}
