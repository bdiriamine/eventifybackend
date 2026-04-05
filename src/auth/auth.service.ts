// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '../users/user.schema'; // Import the UserRole enum

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');
    const hashed = await bcrypt.hash(dto.password, 12);
    // Use the enum value instead of the string 'client'
    const user = await this.usersService.create({ 
      ...dto, 
      password: hashed, 
      role: UserRole.CLIENT  // Changed from 'client' to UserRole.CLIENT
    });
    const token = this.jwtService.sign({ 
      sub: user._id, 
      email: user.email, 
      role: user.role 
    });
    return { user: this.sanitize(user), accessToken: token };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const token = this.jwtService.sign({ 
      sub: user._id, 
      email: user.email, 
      role: user.role 
    });
    return { user: this.sanitize(user), accessToken: token };
  }

  async getMe(userId: string) {
    const user = await this.usersService.findById(userId);
    return this.sanitize(user);
  }

  private sanitize(user: any) {
    const obj = user.toObject ? user.toObject() : { ...user };
    delete obj.password;
    return obj;
  }
}