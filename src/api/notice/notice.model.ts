import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Generated } from 'typeorm';

@Entity('notice')
export class NoticeModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  notice: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column()
  @Generated("uuid")
  uid: string;
  
}

export class NoticeUpdateModel {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  notice: string;
 
}
