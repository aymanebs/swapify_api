import { IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";


export class CreateChatDto{

    @IsString()
    @IsNotEmpty()
    messages: Types.ObjectId[];
    
    @IsString()
    @IsNotEmpty()
    request: Types.ObjectId;
}