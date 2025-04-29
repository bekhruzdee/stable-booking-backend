// src/auth/auth.service.ts

import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createAuthDto.username },
        { email: createAuthDto.email },
      ],
    });

    if (existingUser) {
      throw new ConflictException('Username or Email already exists.');
    }

    const user = this.userRepository.create();
    user.username = createAuthDto.username;
    user.password = await bcrypt.hash(createAuthDto.password, 10);
    user.email = createAuthDto.email;

    await this.userRepository.save(user);
    return 'You are registered✅';
  }

  async login(createAuthDto: CreateAuthDto, res: Response) {
    const user = await this.validateUser(
      createAuthDto.username,
      createAuthDto.password,
    );
    const tokens = this.generateTokens(user);

    this.setRefreshTokenCookie(res, tokens.refreshToken);

    const { password, ...userData } = user;
    return res.json({ userData, access_token: tokens.accessToken });
  }

  private async validateUser(username: string, password: string) {
    const user = await this.userRepository.findOneBy({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials ⚠️');
    }
    return user;
  }

  private generateTokens(user: User) {
    const payload = { id: user.id, username: user.username, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  logout(): { message: string } {
    return { message: 'Logout successfully✅' };
  }

  async getAllMyData(payload: any) {
    const user = await this.userRepository.findOneBy({ id: payload.id });
    return user;
  }
}
