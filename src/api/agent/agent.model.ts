
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';
import { isDate } from 'moment';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Generated } from 'typeorm';

@Entity('agents')
export class AgentModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  agentId: string;

  @Column()
  @ApiProperty({default: "Kayes Fahim"})
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(5)
  name: string;

  @Column()
  @ApiProperty({default: "dev@flyjatt.com"})
  @IsEmail()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  email: string;

  @Column()
  @ApiProperty({default: "Fly Jatt Co LTD"})
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(5)
  company: string;

  @Column()
  @ApiProperty({default: "01685370455"})
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  @MinLength(11)
  phone: string;

  @Column()
  @ApiProperty({default: "Dhaka, Bangladesh"})
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(100)
  address: string;

  @Column()
  @ApiProperty({default: "12345678"})
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  @MinLength(8)
  password: string;

  @Column()
  status: string;

  @Column()
  is_verified: boolean;

  @Column()
  logo: string;

  @Column()
  credit: number;

  @Column()
  markuptype: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  markup: number;

  @Column()
  clientmarkuptype: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  clientmarkup: number;

  @Column()
  searchlimit: number;

  @ApiProperty({default: "Image link"})
  @Column()
  nid: string;

  @ApiProperty({default: "Image Link"})
  @Column()
  tradelicense: string;

  @ApiProperty({default: "12345678"})
  @Column()
  civilaviationno: string;

  @Column()
  acc_key_manager: string;

  @Column()
  partial_eligibility: boolean;

  @Column()
  ip: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  @Generated('uuid')
  uid: string;
}

export class AgentModelUpdateAdmin {

  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  email: string;

  @ApiPropertyOptional()
  is_verified: boolean;

  @ApiPropertyOptional()
  company: string;

  @ApiPropertyOptional()
  phone: string;

  @ApiPropertyOptional()
  status: string;

  @ApiPropertyOptional()
  searchlimit: number;

  @ApiPropertyOptional()
  acc_key_manager: string;

  @ApiPropertyOptional()
  partial_eligibility: boolean;

  @ApiPropertyOptional()
  civilaviationno: string;

}

export class AgentModelUpdateAgent{

  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  phone: string;

  @ApiPropertyOptional()
  address: string;

  @ApiPropertyOptional()
  markuptype: string;

  @ApiPropertyOptional()
  markup: number;

  @ApiPropertyOptional()
  password: string;

}

export class AgentMarkUpUpdate{
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  markuptype: string;

  @ApiProperty()
  @IsNotEmpty()
  markup: number;
}

export class AgentBalanceUpdate{

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount : number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  trxtype : string;

  @ApiProperty()
  refId : string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  details : string;

  @ApiProperty()
  ticketcost : number;

  @ApiProperty()
  @IsString()
  pnr : string;

}

@Entity('credit_summery')
export class AgentCreditModel{

  @PrimaryGeneratedColumn()
  id : number;

  @Column()
  agentId: string;

  @ApiProperty()
  @Column()
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty()
  @Column()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Column()
  credited_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}


