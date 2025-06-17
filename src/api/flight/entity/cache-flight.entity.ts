import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('flight_cache')
export class FlightCacheModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  resultid: string;

  @Column()
  triptype: string;

  @Column()
  depdate: string;

  @Column()
  returndate: string;

  @Column()
  depfrom: string;

  @Column()
  arrto: string;

  @Column()
  class: string;

  @Column()
  adult: number;

  @Column()
  child: number;

  @Column()
  infant: number;

  @Column({type: 'json',})
  data: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
