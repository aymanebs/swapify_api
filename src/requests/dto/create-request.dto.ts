import { IsEnum, IsString } from "class-validator";
import { RequestStatus } from "src/enums/request-status.enum";

export class CreateRequestDto {

    @IsString()
    receiver: string;

    @IsString()
    itemOffered: string;

    @IsString()
    itemRequested: string;

    @IsEnum(RequestStatus)
    status?: RequestStatus ;
}
