import { ApiProperty } from '@nestjs/swagger';


export class SeapMapDto{

  @ApiProperty({default: "Sabre"})
  System: string;
  
  @ApiProperty({default:"2025-01-10"})
  DepDate: string;

  @ApiProperty({default:"DAC"})
  Origin: string;

  @ApiProperty({default:"DXB"})
  Destination: string;

  @ApiProperty({default:"GF"})
  Carrier: string;

  @ApiProperty({default:"200"})
  FlightNumber: string;

  @ApiProperty({default:"Y"})
  CabinClass: string;

}

