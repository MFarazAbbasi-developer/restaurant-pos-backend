import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(
    name: string,
    email: string,
    password: string,
    role: Role = Role.ONLINE_CUSTOMER,
  ) {
    const existing = await this.prisma.customer.findUnique({
      where: { email },
    });

    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await this.prisma.customer.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // const { password: _, ...result } = customer; // Exclude password from returned object
    // return result;
    return this.signToken(customer.id, customer.email, customer.role);
  }

  async login(email: string, password: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { email },
    });

    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, customer.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken(customer.id, customer.email, customer.role);
  }

  private signToken(userId: string, email: string, role: Role) {
    return {
      access_token: this.jwt.sign({
        sub: userId,
        email,
        role,
      }),
    };
  }
}
