import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('refund')
export class RefundModel{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    agentId: string;

    @Column()
    bookingId: string;

    @ApiProperty()
    @Column()
    passengerdata: string;

    @Column()
    netfare: number;

    @Column()
    refundpenalty: number;

    @Column()
    servicefee: number;

    @Column()
    quotationamount: number;

    @Column()
    status: string;
    
    @Column()
    remarks: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @Column()
    @Generated("uuid")
    uid: string;


}

export class RefundRequestModel{

    @ApiProperty({default: "Given name/Surname-TicketNumber"})
    text: string;
    
}

export class RefundQuotation{

    @ApiProperty()
    refundpenalty: number;

    @ApiProperty()
    servicefee: number;

    @ApiProperty()
    quotationamount: number;

    @ApiPropertyOptional()
    remarks: string
}

export class RefundDecisionModel{

    @ApiPropertyOptional()
    remarks: string
}