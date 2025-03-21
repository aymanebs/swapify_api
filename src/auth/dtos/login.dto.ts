import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class loginDto{
    @ApiProperty({ description: 'User email', example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'User password', example: 'password123' })
    @IsString()
    @MinLength(8)
    password: string;
}