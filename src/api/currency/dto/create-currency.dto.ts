import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateCurrencyDto {
  @ApiProperty({ example: 'USD', description: 'Base currency code' })
  @IsString()
  base: string;

  @ApiProperty({ example: 'EUR', description: 'Alternate currency code' })
  @IsString()
  alternate: string;

  @ApiProperty({ example: 0.9150, description: 'Exchange rate from base to alternate' })
  @IsNumber()
  exchange_rate: number;
}
