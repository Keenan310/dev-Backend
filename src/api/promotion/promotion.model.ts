import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('promotion')
export class PromotionModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  category: string

  @ApiProperty()
  @Column()
  caption: string;

  @ApiProperty()
  @Column()
  image: string;

  @ApiProperty()
  @Column()
  link: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
