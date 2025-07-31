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

  @Column()
  TripType: string;

  @Column()
  PNR: string;

  @Column()
  Carrier: string;

  @Column()
  RouteFrom: string;

  @Column()
  RouteTo: string;

  @Column()
  DepDate: string;

  @Column()
  NetFare: number;

  @Column()
  Baggage: string;

  @Column()
  seatsAvailable: string;

  @Column()
  mealCode: string;

  @Column()
  segment: number;

  @Column()
  DepartureFrom: string;

  @Column()
  ArrivalTo: string;

  @Column()
  DepTime: string;

  @Column()
  ArrTime: string;

  @Column()
  FlightNumber: string;

  @Column()
  DepartureFrom1: string;

  @Column()
  ArrivalTo1: string;

  @Column()
  DepTime1: string;

  @Column()
  ArrTime1: string;

  @Column()
  FlightNumber1: string;

  @Column()
  rDepFrom: string;

  @Column()
  rSegment: string;

  @Column()
  rArrTo: string;

  @Column()
  rFlightNo: string;

  @Column()
  rDepTime: string;

  @Column()
  rArrTime: string;

  @Column()
  rDepFrom1: string;

  @Column()
  rArrTo1: string;

  @Column()
  rFlightNo1: string;

  @Column()
  rDepTime1: string;

  @Column()
  rArrTime1: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @Column()
  @Generated("uuid")
  uid: string;
}

export class GroupFareDto{

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
