import { IsInt, IsNotEmpty, IsPositive, IsString, Min } from 'class-validator';

export class CreateHorseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  age: number;

  @IsNotEmpty()
  @IsString()
  breed: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  ownerId: number;
}
