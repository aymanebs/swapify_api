import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto{

    @ApiProperty({ description: 'Category name', example: 'Electronics' })
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name: string
}