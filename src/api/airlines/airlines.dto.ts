import { PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString, IsArray } from 'class-validator';

export class CreateAirlineDiscountDto {
  @IsString()
  airline: string;

  @IsOptional()
  @IsNumber()
  discount_percent?: number;

  @IsOptional()
  @IsNumber()
  fix_discount?: number;

  @IsOptional()
  @IsString()
  travel_date: string;

  @IsOptional()
  @IsString()
  booking_date: string;

  @IsString()
  currency: string;

  @IsOptional()
  @IsArray()
  from_list?: string[];

  @IsOptional()
  @IsArray()
  to_list?: string[];

  @IsOptional()
  @IsArray()
  rbd?: string[];

  @IsOptional()
  @IsArray()
  source?: string[];
}


export class UpdateAirlineDiscountDto extends PartialType(CreateAirlineDiscountDto) {}
