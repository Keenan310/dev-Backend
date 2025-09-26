import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], 
      inject: [ConfigService],

      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        url: configService.get('DATABASE_URL'), 
        entities: [],
        autoLoadEntities: true,
        synchronize: false,
        logging: false,
        timezone: '+04:00',
        keepConnectionAlive: true,
        extra: {
          connectionLimit: 10,
          connectTimeout: 60000,
        },
      }),
    }),
  ],
})

export class DatabaseModule {}