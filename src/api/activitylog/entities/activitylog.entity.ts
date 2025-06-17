import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('activitylog')
export class ActivityLogModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  agentId: string;

  @Column()
  refId: string;

  @Column()
  status: string;

  @Column()
  module: string;

  @Column()
  action_description: string;

  @Column()
  action_by: string;

  @Column()
  remarks: string;

  @Column()
  platform: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}

