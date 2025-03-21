import { IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto{

    @ApiProperty({ description: 'Array of message IDs', example: ['64c9b1a1e4b0f5b5e4f0e1a1'] })
    @IsString()
    @IsNotEmpty()
    messages: Types.ObjectId[];
    
    @ApiProperty({ description: 'Request ID', example: '64c9b1a1e4b0f5b5e4f0e1a1' })
    @IsString()
    @IsNotEmpty()
    request: Types.ObjectId;
}