
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
  amount: number;

  @Column()
  refId: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column()
  remarks: string

  @Column()
  companyname: string

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column()
  @Generated("uuid")
  uid: string;

}
