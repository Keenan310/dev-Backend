
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('currency_converter')
export class CurrencyConverter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  airline: string;

  @Column()
  source: string;

  @Column()
  base: string;

  @Column()
  alternate: string;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  exchange_rate: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}

