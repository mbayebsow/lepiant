import { PartialType } from '@nestjs/swagger';
import { CreateQuotidienDto } from './create-quotidien.dto';

export class UpdateQuotidienDto extends PartialType(CreateQuotidienDto) {}
