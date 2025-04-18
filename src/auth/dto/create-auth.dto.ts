import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty({ message: 'Username is required❌' })
  @IsString({ message: 'Username must be a string❌' })
  @MinLength(6, { message: 'Username must be at least 3 characters❌' })
  username: string;

  @IsNotEmpty({ message: 'Email is required❌' })
  @IsEmail({}, { message: 'Invalid email format❌' })
  email: string;

  @IsNotEmpty({ message: 'Password is required❌' })
  @IsString({ message: 'Password must be a string❌' })
  @MinLength(8, { message: 'Password must be at least 8 characters❌' })
  password: string;
}
