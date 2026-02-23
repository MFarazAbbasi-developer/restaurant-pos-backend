import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AddressModule } from './address/address.module';
import { OrdersModule } from './orders/orders.module';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [AuthModule, PrismaModule, AddressModule, OrdersModule, MenuModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
