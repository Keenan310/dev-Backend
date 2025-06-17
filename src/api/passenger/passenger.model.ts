// passenger.entity.ts

import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Generated } from 'typeorm';

@Entity('passengers')
export class PassengerModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  agentId: string;

  @Column()
  bookingId: string;

  @Column()
  prefix: string;

  @Column()
  givenname: string;

  @Column()
  surname: string;

  @Column({ type: 'date' })
  dob: Date;

  @Column()
  type: string;

  @Column()
  nationality: string;

  @Column()
  document: string;

  @Column({ type: 'date' })
  expiredate: Date;


  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  ticketnumber: string;

  @Column()
  ticketstatus: string;

  @Column()
  gender: string;

  @Column()
  passport: string;

  @Column()
  visa: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;

  @Column()
  @Generated("uuid")
  uid: string;
}

export class PassengerModelUpdate {


  @ApiProperty()
  @Column()
  givenname: string;

  @ApiProperty()
  @Column()
  surname: string;

  @ApiProperty()
  @Column({ type: 'date' })
  dob: Date;

  @ApiProperty()
  @Column()
  type: string;

  @ApiProperty()
  @Column()
  nationality: string;

  @ApiProperty()
  @Column()
  document: string;

  @ApiProperty()
  @Column({ type: 'date' })
  expiredate: Date;

  @ApiProperty()
  @Column()
  phone: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  gender: string;

}
