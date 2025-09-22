import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column, Entity, Generated, PrimaryGeneratedColumn } from "typeorm";


@Entity('void')
export class VoidModel {

  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  bookingId: string;

  @Column()
  agentId: string;

  @Column()
  @ApiProperty({default: 'MD KAYES HOSSAN - 23456789087654'})
  @IsString()
  @IsNotEmpty()
  passengerdata: string;

  @Column()
  amount: number;

  @Column()
  servicefee: number;

  @Column()
  @ApiProperty({default: 'Name Mistake'})
  @IsString()
  @IsNotEmpty()
  reason: string;

  @Column()
  status: string;

  @Column()
  remarks: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @Column()
  @Generated("uuid")
  uid: string;

}

export class VoidDesicion{
  @ApiPropertyOptional()
  remarks : string;
}