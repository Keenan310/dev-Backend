import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Generated } from 'typeorm';

@Entity('partial_payment')
export class PartialPaymentModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'agentId' })
  agentId: string;

  @Column({ name: 'bookingId' })
  bookingId: string;

  @Column({ name: 'carrier' })
  carrier: string;

  @Column({ name: 'pnr' })
  pnr: string;

  @Column({ name: 'netfare' })
  netfare: number;

  @Column({ name: 'paidamount' })
  paidamount: number;

  @Column({ name: 'dueamount' })
  dueamount: number;

  @Column()
  status: string;

  @Column()
  flightdate: string;

  @Column({ name: 'due_at' })
  dueAt: string;

  @Column()
  companyname: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column()
  @Generated('uuid')
  uid: string;
}
