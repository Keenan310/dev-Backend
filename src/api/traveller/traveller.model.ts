// Traveller.entity.ts

import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Generated } from 'typeorm';

@Entity('travellers')
export class TravellerModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  agentId: string;

  @Column()
  prefix: string;

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
  gender: string;

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

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;

  @Column()
  @Generated("uuid")
  uid: string;
}

export class TravellerModelUpdate {


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
