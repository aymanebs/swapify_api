import { IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Types } from "mongoose";


export class CreateMessageDto{

    @IsNotEmpty()
    @IsString()
    sender: Types.ObjectId;

    @IsNotEmpty()
    @IsString()
    chatId: Types.ObjectId;

    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    content: string;
}