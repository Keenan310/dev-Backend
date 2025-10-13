import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateAirlineDiscountDto {
  @IsString()
  airline: string;

  @IsString()
  from_location: string;

  @IsOptional()
  @IsNumber()
  discount_percent?: number;

  @IsOptional()
  @IsNumber()
  fix_discount?: number;

  @IsString()
  travel_date: string;

  @IsString()
  booking_date: string;

  @IsOptional()
  @IsString()
  from_list?: string;

  @IsOptional()
  @IsString()
  from_except?: string;

  @IsOptional()
  @IsString()
  to_list?: string;

  @IsOptional()
  @IsString()
  to_except?: string;

  @IsOptional()
  @IsString()
  rbd?: string;

  @IsOptional()
  @IsString()
  source?: string;
}

export class UpdateAirlineDiscountDto extends PartialType(CreateAirlineDiscountDto) {}
