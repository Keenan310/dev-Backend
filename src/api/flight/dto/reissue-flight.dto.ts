import { ApiProperty } from "@nestjs/swagger";
import { ArrayMaxSize, ArrayMinSize, IsDate, IsString, Length } from "class-validator";

class SegmentDto {
    @ApiProperty({ default: 'DAC' })
    @IsString()
    @Length(3, 3)
    depfrom: string;
  
    @ApiProperty({ default: 'DXB' })
    @IsString()
    @Length(3, 3)
    arrto: string;
  
    @ApiProperty( { default: '2024-07-01' })
    @IsDate()
    depdate: Date;
}

export class ReissueDto{

    @ApiProperty({default: "Sabre"})
    system: string;
  
    @ApiProperty({default:"123456789"})
    ticketNo: number;
  
    @ApiProperty({ type: [SegmentDto] })
    @ArrayMinSize(1)
    @ArrayMaxSize(4)
    segments: SegmentDto[];
  
  }