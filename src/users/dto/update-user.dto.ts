import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString({ message: 'Username must be a string❌' })
  @MinLength(3, { message: 'Username must be at least 3 characters long❌' })
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address❌' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Password must be a string❌' })
  @MinLength(6, { message: 'Password must be at least 6 characters long❌' })
  password?: string;
}
