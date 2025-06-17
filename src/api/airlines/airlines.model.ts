import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, Generated } from 'typeorm';

@Entity('airlinesdata')
export class AirlinesModel{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  iata: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  soto: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  soti: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  sito: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  domestic: number;

  @Column({ name: 'addamount' })
  addAmount: number;

  @Column({ name: 'instant_payment' })
  instantPayment: boolean;

  @Column({ name: 'issue_permit', default: 'manual' })
  issuePermit: string;

  @Column({ name: 'is_blocked', default: false })
  isBlocked: boolean;

  @Column({ default: true })
  bookable: boolean;

  @Column()
  docs: string;

  @Column()
  icao: string;

  @Column()
  marketing_name: string;

  @Column()
  full_name: string;

  @Column()
  status: string;

  @Column()
  type: string;

  @Column()
  alliance: string;

  @Column({ name: 'ffp_name' })
  ffpName: string;

  @Column({ name: 'lowcost' })
  lowCost: string;

  @Column({ name: 'country_name' })
  countryName: string;

  @Column()
  founded: string;

  @Column({ name: 'baggage_url' })
  baggageUrl: string;

  @Column()
  website: string;

  @Column({ name: 'web_checkin_url' })
  webCheckinUrl: string;

  @Column({ name: 'mobile_checkin_url' })
  mobileCheckinUrl: string;

  @Column()
  logo: string;

  @Column({ name: 'created_at' })
  createdAt: string;

  @Column({ name: 'updated_at' })
  updatedAt: string;

  @Column()
  @Generated('uuid')
  uid: string;
}

export class AirlinesUpdateModel {
  
  @ApiProperty()
  @IsNumber()
  soto: number;

  @ApiProperty()
  @IsNumber()
  soti: number;

  @ApiProperty()
  @IsNumber()
  sito: number;

  @ApiProperty()
  @IsNumber()
  domestic: number;

  @ApiProperty()
  @IsNumber()
  addAmount: number;

  @ApiProperty()
  @IsBoolean()
  instantPayment: boolean;

  @ApiProperty()
  @IsString()
  issuePermit: string;

  @ApiProperty()
  @IsBoolean()
  isBlocked: boolean;

  @ApiProperty()
  @IsBoolean()
  bookable: boolean;

}
