import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { Types } from "mongoose";


export class CreateItemDto{

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    name: string

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    description: string

    @IsNotEmpty()
    @IsString()
    condition: string

    @IsNotEmpty()
    @IsString()
    category: Types.ObjectId

    @IsNotEmpty()
    photos: string[]

}