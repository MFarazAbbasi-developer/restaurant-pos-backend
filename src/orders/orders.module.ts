import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from '../prisma/prisma.module'; // your Prisma module
import { JwtModule } from '@nestjs/jwt';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
