import { Controller, Post, Body } from '@nestjs/common';
import { CustomersService } from '../customers/customers.service';
import { CreateCustomerDto } from '../customers/dto/create-customer.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private customersService: CustomersService,
    private authService: AuthService,
  ) {}

  // Registration
  @Post('register')
  async register(@Body() dto: CreateCustomerDto) {
    const customer = await this.customersService.create(dto);
    return { status: 'success', customerId: customer.id };
  }

  // Login
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
