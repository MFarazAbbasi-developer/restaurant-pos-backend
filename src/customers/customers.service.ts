import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCustomerDto) {
    // Check if phone or email exists
    // const existing = await this.prisma.customer.findFirst({
    //   where: {
    //     OR: [
    //       { phone: dto.phone },
    //       dto.email ? { email: dto.email } : undefined,
    //     ].filter(Boolean),
    //   },
    // });



    

    // Build OR conditions without undefined
    // const orConditions = [{ phone: dto.phone }];
    // if (dto.email) {
    //   orConditions.push({ email: dto.email });
    // }
    const orConditions: any[] = [{ phone: dto.phone }];
    if (dto.email) {
      orConditions.push({ email: dto.email });
    }

    // Check if phone or email exists
    const existing = await this.prisma.customer.findFirst({
      where: {
        OR: orConditions,
      },
    });

    if (existing) {
      throw new BadRequestException('Phone or email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Save customer
    const customer = await this.prisma.customer.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
    });

    return customer;
  }
}
