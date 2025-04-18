import { IsInt, IsNotEmpty, IsPositive, IsString, Min } from 'class-validator';

export class CreateHorseDto {
  @IsNotEmpty({ message: 'Horse name must not be empty❌' })
  @IsString({ message: 'Horse name must be a string❌' })
  name: string;

  @IsInt({ message: 'Age must be an integer❌' })
  @Min(0, { message: 'Age must be 0 or greater❌' })
  age: number;

  @IsNotEmpty({ message: 'Breed must not be empty❌' })
  @IsString({ message: 'Breed must be a string❌' })
  breed: string;

  @IsNotEmpty({ message: 'Owner ID must not be empty❌' })
  @IsInt({ message: 'Owner ID must be an integer❌' })
  @IsPositive({ message: 'Owner ID must be a positive number❌' })
  ownerId: number;
}
