import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';

@Controller('addresses')
// @UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateAddressDto) {
    return this.addressService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Req() req) {
    return this.addressService.findAll(req.user.userId);
  }
}
