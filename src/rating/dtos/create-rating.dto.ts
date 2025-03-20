import { IsMongoId, IsNotEmpty, IsInt, Min, Max, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRatingDto {
  @IsMongoId()
  @IsNotEmpty()
  ratedUser: string;

  @IsMongoId()
  @IsNotEmpty()
  raterUser: string;

  @IsMongoId()
  @IsNotEmpty()
  request: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  score: number;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  comment?: string;
}
