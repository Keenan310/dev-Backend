import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('search_histories')
export class SearchHistoryModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    agentId: string;

    @Column()
    companyname: string;

    @Column()
    triptype: string;

    @Column()
    depfrom: string;

    @Column()
    arrto: string;

    @Column()
    depdate: Date;

    @Column()
    returndate: Date;

    @Column()
    adult: number;

    @Column()
    child: number;

    @Column()
    infant: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
