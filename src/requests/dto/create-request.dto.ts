import { IsEnum, IsString } from "class-validator";
import { RequestStatus } from "src/enums/request-status.enum";
import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestDto {

    @ApiProperty({
        description: 'ID of the receiver user',
        example: '64c9b1a1e4b0f5b5e4f0e1a1',
      })
    @IsString()
    receiver: string;

    @ApiProperty({
        description: 'ID of the item offered by the sender',
        example: '64c9b1a1e4b0f5b5e4f0e1a1',
      })
    @IsString()
    itemOffered: string;

    @ApiProperty({
        description: 'ID of the item requested by the sender',
        example: '64c9b1a1e4b0f5b5e4f0e1a1',
      })    
    @IsString()
    itemRequested: string;

    @ApiProperty({
        description: 'Status of the request',
        enum: RequestStatus,
        example: RequestStatus.PENDING,
        required: false,
      })
    @IsEnum(RequestStatus)
    status?: RequestStatus ;
}
