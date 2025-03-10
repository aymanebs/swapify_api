import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from './create-items.dto';

export class UpdateItemDto extends PartialType(CreateItemDto){}
