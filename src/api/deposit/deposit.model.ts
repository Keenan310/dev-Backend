import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, Generated } from 'typeorm';

@Entity('deposits')
export class DepositModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  agentId: string;

  @Column()
  depositId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  amount: number;

  @Column()
  sender: string;

  @Column()
  receiver: string;

  @Column()
  paymentway: string;

  @Column()
  paymentId: string;

  @Column()
  trxId: string;

  @Column()
  status: string;

  @Column()
  ref: string;

  @Column()
  remarks: string;

  @Column()
  companyname: string;

  @Column()
  attachment: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column()
  @Generated("uuid")
  uid: string;
}

export class DepositModelUpdate{

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sender: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  receiver: string;

  @ApiPropertyOptional()
  paymentway: string;

  @ApiPropertyOptional()
  status: string;

  @ApiPropertyOptional()
  ref: string;

  @ApiPropertyOptional()
  remarks: string;
  
}

export class DepositModelUpdateStatus{

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional()
  remarks: string;
  
}

export class DepositBonuseModel{

  @ApiProperty()
  @IsNumber()
  bonus: number;

  @ApiProperty()
  @IsString()
  refId: string;

}

