import { IsEmail, IsString, MaxLength, MinLength} from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto{
    @ApiProperty({ description: 'User first name', example: 'John' })
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    first_name:string;

    @ApiProperty({ description: 'User last name', example: 'Doe' })
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    last_name:string;
    
    @ApiProperty({ description: 'User email', example: 'user@example.com' })
    @IsEmail()
    email:string;

    @ApiProperty({ description: 'User avatar URL', example: 'https://example.com/avatar.jpg' })
    @IsString()
    avatar: string;

    @ApiProperty({ description: 'User password', example: 'password123*' })
    @IsString()
    @MinLength(8)
    password:string;
}