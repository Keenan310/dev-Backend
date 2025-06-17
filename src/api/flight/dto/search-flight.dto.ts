import { ApiProperty } from "@nestjs/swagger";
import { ArrayMaxSize, ArrayMinSize, IsDate, IsInt, IsOptional, IsPositive, IsString, Length } from "class-validator";

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
  
  export class FlightSearchModel {
    @ApiProperty({ default: 1 })
    @IsInt()
    @IsPositive()
    adultcount: number;
  
    @ApiProperty({ default: 0 })
    @IsInt()
    childcount: number;
  
    @ApiProperty({ default: 0 })
    @IsInt()
    infantcount: number;
  
    @ApiProperty({ default: 2 })
    @IsOptional()
    connection: string = '2' ;
  
    @ApiProperty({ default: 'Y' })
    @IsString()
    @Length(1, 1)
    cabinclass: string = 'Y';
  
    @ApiProperty({ type: [SegmentDto] })
    @ArrayMinSize(1)
    @ArrayMaxSize(4)
    segments: SegmentDto[];
  }