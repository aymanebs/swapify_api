import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { Types } from "mongoose";
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto{

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    @ApiProperty({ description: 'The name of the item', example: 'Vintage Camera' })
    name: string

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @ApiProperty({ description: 'The description of the item', example: 'A vintage camera from the 1980s.' })
    description: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'The condition of the item', example: 'Used' })
    condition: string

    @IsNotEmpty()
    @IsString()
    category: Types.ObjectId

    @IsNotEmpty()
    photos: string[]

}