
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Generated } from 'typeorm';

@Entity('staffs')
export class StaffModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  agentId: string;

  @Column()
  @ApiProperty({default: "Kayes Fahim"})
  name: string;

  @Column()
  @ApiProperty({default: "staff@flyjatt.com"})
  @IsEmail()
  email: string

  @Column()
  @ApiProperty({default: "01685370455"})
  phone: string;

  @Column()
  @ApiProperty({default: "12345678"})
  password: string;

  @Column()
  @ApiProperty({default: "Accountant"})
  role: string;

  @Column()
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  @Generated("uuid")
  uid: string;
}

export class StaffModelUpdateByAgent {
  
  @ApiPropertyOptional({default: "Kayes Fahim"})
  name: string;

  @ApiPropertyOptional({default: "staff@flyjatt.com"})
  @IsEmail()
  email: string

  @ApiPropertyOptional({default: "01685370455"})
  phone: string;

  @ApiPropertyOptional({default: "12345678"})
  password: string;

  @ApiPropertyOptional({default: "accountant"})
  role: string;

  @ApiPropertyOptional({default: "pending"})
  status: string;
}

export class StaffModelUpdate {
    @ApiPropertyOptional({default: "Kayes Fahim"})
    name: string;
  
    @ApiPropertyOptional({default: "01685370455"})
    phone: string;
  
    @ApiPropertyOptional({default: "12345678"})
    password: string;

}

