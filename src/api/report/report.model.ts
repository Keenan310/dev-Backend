
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Generated } from 'typeorm';

@Entity('agent_ledger')
export class AgentLedgerModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  agentId: string;

  @Column()
  trxtype: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  debit: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  credit: number;

  @Column()
  refId: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column()
  remarks: string

  @Column()
  companyname: string

  @Column()
  ticketcost: number

  @Column()
  netfare: number

  @Column()
  pnr: string

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column()
  @Generated("uuid")
  uid: string;

}

@Entity('admin_ledger')
export class AdminLedger {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'text' })
  description: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  pnr: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  ticketprice: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  supplier: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  agentcode: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  netfare: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  profit: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  deposit: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 50 })
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}

export class UpdateAdminLedgerDto extends PartialType(AdminLedger) {}

@Entity('admin_expense')
export class AdminExpenseModel{
  @PrimaryGeneratedColumn()
  id: number;


  @Column()
  @ApiProperty()
  details: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  @ApiProperty()
  amount: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column()
  @Generated("uuid")
  uid: string;
}
