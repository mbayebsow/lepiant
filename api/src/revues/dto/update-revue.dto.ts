import { PartialType } from '@nestjs/swagger';
import { CreateRevueDto } from './create-revue.dto';

export class UpdateRevueDto extends PartialType(CreateRevueDto) {}
