// create-control.dto.ts

import { IsString, IsDate } from 'class-validator';

export class CreateControlDto {
  @IsString()
  readonly system: string;

  @IsString()
  readonly pcc: string;

  @IsString()
  readonly pcccountry: string;

  @IsString()
  readonly status: string;

  @IsDate()
  readonly created_at: Date;

  @IsDate()
  readonly updated_at: Date;
}
