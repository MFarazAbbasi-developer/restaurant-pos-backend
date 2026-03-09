import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CustomersModule } from '../customers/customers.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    CustomersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecretkey', // Use env variable in production
      signOptions: { expiresIn: '1d' }, // token validity
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
