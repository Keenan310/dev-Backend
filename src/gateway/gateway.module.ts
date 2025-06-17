import { Module } from '@nestjs/common';
import { EventsGateway } from './gateway';

@Module({
    imports: [EventsGateway]
})
export class GatewayModule {}
