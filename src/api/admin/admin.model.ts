// admin.entity.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, Generated } from 'typeorm';

@Entity('admin')
export class AdminModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  adminId: string;

  @ApiProperty({default: "Uazzal"})
  @IsNotEmpty()
  @IsString()
  @Column()
  firstname: string;

  @ApiProperty({default: "Hossain"})
  @IsNotEmpty()
  @IsString()
  @Column()
  lastname: string;

  @ApiProperty({default: "admin@flyjatt.com"})
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Column()
  email: string;

  @ApiProperty({default: "12345678"})
  @IsNotEmpty()
  @IsString()
  @Column()
  password: string;

  @ApiProperty({default: "01685370455"})
  @IsNotEmpty()
  @IsString()
  @Column()
  phone: string;

  @Column()
  status : string;

  @ApiProperty({default: "superadmin"})
  @IsNotEmpty()
  @IsString()
  @Column()
  role: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @Column()
  @Generated("uuid")
  uid: string;
}

export class AdminModelUpdate {

  @ApiProperty()
  @Column()
  firstname: string;

  @ApiProperty()
  @Column()
  lastname: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @Column()
  phone: string;

  @ApiProperty()
  @Column()
  status : string;

  @ApiProperty()
  @Column()
  role: string;

}
