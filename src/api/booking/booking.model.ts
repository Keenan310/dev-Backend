import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, Generated } from 'typeorm';

@Entity('bookings')
export class BookingModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  agentId: string;

  @Column()
  bookingId: string;

  @Column()
  system: string;

  @Column()
  triptype: string;

  @Column()
  pnr: string;

  @Column()
  airlinespnr: string;

  @Column()
  carrier_name: string;

  @Column()
  carrier_code: string;

  @Column()
  depfrom: string;

  @Column()
  arrto: string;

  @Column()
  refundable: string

  @Column()
  instant_payment: boolean

  @Column()
  issue_permit: string

  @Column()
  status: string;

  @Column()
  payment_status : string

  @Column()
  netfare: number;

  @Column()
  grossfare: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  adultcount: number;

  @Column()
  childcount: number;

  @Column()
  infantcount: number;

  @Column()
  totalpax: number;

  @Column()
  ticketcopy: string;

  @Column()
  ticketed_at: Date;

  @Column()
  purchaseprice: number;

  @Column()
  sellprice: number;

  @Column()
  comission: number;

  @Column()
  totalsegment: number;

  @Column()
  timelimit: string;

  @Column()
  flightdate: string;

  @Column({ type: 'json' })
  flightdata: any;

  @Column({ type: 'json' })
  itenary : any;

  @Column()
  companyname: string

  @Column({default: false})
  imported: boolean

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column()
  @Generated("uuid")
  uid: string;
}

export class BookingModelUpdateAdmin {

  @ApiProperty()
  system: string;

  @ApiProperty()
  triptype: string;

  @ApiProperty()
  pnr: string;

  @ApiProperty()
  carrier: string;

  @ApiProperty()
  depfrom: string;

  @ApiProperty()
  arrto: string;

  @ApiProperty()
  refundable: string

  @ApiProperty()
  status: string;

  @ApiProperty()
  netfare: number;

  @ApiProperty()
  grossfare: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  adultcount: number;

  @ApiProperty()
  childcount: number;

  @ApiProperty()
  infantcount: number;

  @ApiProperty()
  totalpax: number;

  @ApiProperty()
  ticketcopy: string;

  @ApiProperty()
  timelimit: string;
}

export class TicketModel{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  agentId: string;

  @Column()
  bookingId: string;

  @Column()
  system : string;

  @Column()
  pnr : string;

  @Column()
  name : string;

  @Column()
  ticketnumber : string;

}
