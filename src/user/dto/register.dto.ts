/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsNumber, IsOptional, IsEmail } from 'class-validator';

export class RegisterDTO {
  @IsEmail()
  readonly email: string;
  @IsString()
  readonly password: string;
  @IsString()
  readonly name: string;
  @IsString()
  @IsOptional()
  readonly tel: string;
}
