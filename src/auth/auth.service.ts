// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { Prisma } from '@prisma/client'; // <-- Add this import

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    // Explicitly type the OR conditions
    const orConditions: Prisma.CustomerWhereInput[] = [];

    if (dto.email) orConditions.push({ email: dto.email });
    if (dto.phone) orConditions.push({ phone: dto.phone });

    if (orConditions.length === 0) {
      throw new UnauthorizedException('Email or phone is required');
    }

    const customer = await this.prisma.customer.findFirst({
      where: {
        OR: orConditions,
      },
    });

    if (!customer) throw new UnauthorizedException('Invalid credentials');

    // Check password
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      customer.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    // Generate JWT
    const token = this.jwtService.sign({
      sub: customer.id,
      role: customer.role,
    });

    return {
      accessToken: token,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
    };
  }
}