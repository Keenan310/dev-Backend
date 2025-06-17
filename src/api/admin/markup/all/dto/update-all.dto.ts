import { PartialType } from '@nestjs/swagger';
import { CreateAllDto } from './create-all.dto';

export class UpdateAllDto extends PartialType(CreateAllDto) {}
