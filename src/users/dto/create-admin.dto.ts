import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsIn,
} from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty({ message: 'Username is required❌' })
  @IsString({ message: 'Username must be a string❌' })
  @MinLength(3, { message: 'Username must be at least 3 characters❌' })
  username: string;

  @IsNotEmpty({ message: 'Email is required❌' })
  @IsEmail({}, { message: 'Email must be a valid email address❌' })
  email: string;

  @IsNotEmpty({ message: 'Password is required❌' })
  @IsString({ message: 'Password must be a string❌' })
  @MinLength(6, { message: 'Password must be at least 6 characters❌' })
  password: string;

  @IsNotEmpty({ message: 'Role is required❌' })
  @IsString({ message: 'Role must be a string❌' })
  @IsIn(['admin'], { message: 'Role must be "admin" only❌' })
  role: string;
}
