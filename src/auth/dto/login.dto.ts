// src/auth/dto/login.dto.ts
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
