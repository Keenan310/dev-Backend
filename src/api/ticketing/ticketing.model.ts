import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Generated } from 'typeorm';

@Entity('ticketed')
export class TicketModel{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  agentId: string;

  @Column()
  bookingId: string;

  @Column()
  vendor: string;

  @Column()
  system: string;

  @Column()
  airlines: string;

  @Column()
  bookingpnr: string;

  @Column()
  airlinespnr: string;

  @Column()
  givenname: string;

  @Column()
  surname: string;

  @Column()
  ticketnumber: string;

  @Column()
  issuetype: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  @Generated('uuid')
  uid: string;
}

export class passengerModel{
  @ApiProperty({default: 'Kayes'})
  @IsNotEmpty()
  @IsString()
  givenname: string;

  @ApiProperty({default: 'Fahim'})
  @IsNotEmpty()
  @IsString()
  surname: string;

  @ApiProperty({default: '123456789000'})
  @IsNotEmpty()
  @IsNumber()
  ticketnumber: number;
}

export class MakeTicketModel{
  @ApiProperty({default: 'TripLover'})
  @IsNotEmpty()
  @IsString()
  vendor: string;

  @ApiProperty({default: 'Sabre'})
  @IsNotEmpty()
  @IsString()
  system: string;

  @ApiProperty({default: 'XDGHJK'})
  @IsNotEmpty()
  @IsString()
  bookingpnr: string;

  @ApiProperty({default: 'XDG3JK'})
  @IsNotEmpty()
  @IsString()
  airlinespnr: string;

  @ApiProperty({default: 'manual'})
  @IsNotEmpty()
  @IsString()
  issuetype: string;

  @ApiProperty({default: '0'})
  @IsNotEmpty()
  @IsNumber()
  purchaseprice: number;

  @ApiProperty({default: '0'})
  @IsNotEmpty()
  @IsNumber()
  sellprice: number;

  @ApiProperty({ type: [passengerModel] })
  @ArrayMinSize(1)
  @ArrayMaxSize(9)
  @IsArray()
  passengerInfo: passengerModel[];
}
