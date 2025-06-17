// groupfare.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsBoolean, IsDate, IsInt, isNotEmpty, IsNotEmpty, isNumber, IsNumber, IsString, maxLength, MaxLength } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, Generated, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('groupfare')
export class GroupFareModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  GroupId: string;

  @ApiProperty({default: 'EK'})
  @Column()
  @IsString()
  @MaxLength(2)
  Carrier: string;

  @ApiProperty({default: 'ERTYGH'})
  @Column()
  PNR: string;

  @ApiProperty({default: 'DAC'})
  @Column()
  @IsString()
  @IsAlpha()
  @MaxLength(3)
  DepFrom: string;

  @ApiProperty({default: 'DXB'})
  @Column()
  @IsString()
  @MaxLength(3)
  @IsAlpha()
  ArrTo: string;

  @ApiProperty({default: '2024-06-01'})
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @Column()
  DepDate: string;

  @ApiProperty({default: '30000'})
  @Column()
  @IsNumber()
  BaseFare: number;

  @ApiProperty({default: '10000'})
  @Column()
  @IsNumber()
  Taxes: number;

  @ApiProperty({default: 'Economy'})
  @Column()
  @IsString()
  Cabinclass: string;

  @ApiProperty({default: '30000'})
  @Column()
  @IsNumber()
  NetFare: number;

  @ApiProperty({default: 'false'})
  @Column()
  @IsBoolean()
  Refundable: boolean;

  @ApiProperty({default: ''})
  @Column()
  TimeLimit: String;

  @ApiProperty({default: '20 KG'})
  @Column()
  @IsString()
  Baggage: string;

  @ApiProperty({default: '50'})
  @Column()
  @IsNumber()
  seatsAvailable: number;

  @ApiProperty({default: 'M'})
  @Column()
  mealCode: string;

  @ApiProperty({default: 'Y'})
  @Column()
  cabinCode: string;

  @ApiProperty({default: 1})
  @Column()
  @IsNumber()
  segment: number;

  @ApiProperty({default: 'DAC'})
  @IsNotEmpty()
  @MaxLength(3)
  @IsAlpha()
  @Column()
  DepartureFrom: string;

  @ApiProperty({default: 'DXB'})
  @IsNotEmpty()
  @MaxLength(3)
  @IsAlpha()
  @Column()
  ArrivalTo: string;

  @ApiProperty({default: '2024-06-01T04:40:00'})
  @IsNotEmpty()
  @IsString()
  @Column()
  DepTime: string;

  @ApiProperty({default: '2024-06-01T023:40:00'})
  @Column()
  @IsNotEmpty()
  @IsString()
  ArrTime: string;

  @ApiProperty({default: '535'})
  @Column()
  @IsNotEmpty()
  @IsString()
  FlightNumber: string;

  @ApiProperty({default: '50'})
  @Column()
  @IsNotEmpty()
  @IsInt()
  Duration: number;

  @ApiProperty({default: 'DXB'})
  @Column()
  DepartureFrom1: string;

  @ApiProperty({default: 'JFK'})
  @Column()
  ArrivalTo1: string;

  @ApiProperty({default: '2024-06-01T04:40:00'})
  @Column()
  DepTime1: string;

  @ApiProperty({default: '2024-06-01T04:40:00'})
  @Column()
  ArrTime1: string;

  @ApiProperty({default: '565'})
  @Column()
  FlightNumber1: string;

  @ApiProperty({default: '50'})
  @Column()
  @IsNotEmpty()
  @IsInt()
  Duration1: number;

  @ApiProperty({default: '50'})
  @Column()
  @IsNotEmpty()
  @IsString()
  Transit: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  @Generated("uuid")
  uid: string;
}

export class GroupFareModelUpdate {

    @ApiProperty({default: 'EK'})
    @Column()
    @IsString()
    Carrier: string;
  
    @ApiProperty({default: 'DAC'})
    @Column()
    @IsString()
    DepFrom: string;
  
    @ApiProperty({default: 'DXB'})
    @Column()
    @IsString()
    ArrTo: string;
  
    @ApiProperty({default: '2024-06-01'})
    @Column()
    DepDate: string;
  
    @ApiProperty({default: '30000'})
    @Column()
    @IsNumber()
    BaseFare: number;
  
    @ApiProperty({default: '10000'})
    @Column()
    @IsNumber()
    Taxes: number;
  
    @ApiProperty({default: 'Economy'})
    @Column()
    @IsString()
    Cabinclass: string;
  
    @ApiProperty({default: '30000'})
    @Column()
    @IsNumber()
    NetFare: number;
  
    @ApiProperty({default: 'true'})
    @Column()
    @IsBoolean()
    Refundable: boolean;
  
    @ApiProperty({default: '2024-06-01T00:00:00'})
    @Column()
    TimeLimit: String;
  
    @ApiProperty({default: '20 KG'})
    @Column()
    @IsString()
    Baggage: string;
  
    @ApiProperty({default: '50'})
    @Column()
    seatsAvailable: number;
  
    @ApiProperty({default: 'M'})
    @Column()
    mealCode: string;
  
    @ApiProperty({default: 'Y'})
    @Column()
    cabinCode: string;
  
    @ApiProperty({default: 'DAC'})
    @Column()
    DepartureFrom: string;
  
    @ApiProperty({default: 'DXB'})
    @Column()
    ArrivalTo: string;
  
    @ApiProperty({default: '2024-06-01T04:40:00'})
    @Column()
    DepTime: string;
  
    @ApiProperty({default: '2024-06-01T023:40:00'})
    @Column()
    ArrTime: string;
  
    @ApiProperty({default: '535'})
    @Column()
    FlightNumber: string;
  
    @ApiProperty({default: 'DXB'})
    @Column()
    DepartureFrom1: string;
  
    @ApiProperty({default: 'JFK'})
    @Column()
    ArrivalTo1: string;
  
    @ApiProperty({default: '2024-06-01T04:40:00'})
    @Column()
    DepTime1: string;
  
    @ApiProperty({default: '2024-06-01T04:40:00'})
    @Column()
    ArrTime1: string;
  
    @ApiProperty({default: '565'})
    @Column()
    FlightNumber1: string;

}

export class GroupFareSearch{

    @ApiProperty({default: 'DAC'})
    @IsString()
    @IsNotEmpty()
    depfrom : string;

    @ApiProperty({default: 'DXB'})
    @IsString()
    @IsNotEmpty()
    arrto : string;

    @ApiProperty({default: '2024-06-12'})
    @IsNotEmpty()
    depdate : string;

}
