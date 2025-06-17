
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class NoteModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  referenceId: string; // Assuming referenceId is a string, you can change the data type as needed

  @Column()
  comment: string;

  @Column()
  created_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
