// control.entity.ts

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('controls')
export class ControlModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  system: string;

  @Column()
  pcc: string;

  @Column()
  pcccountry: string;

  @Column()
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}

