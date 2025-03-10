/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEmail,
  IsBoolean,
} from 'class-validator';

export class UpdateUserDTO {
  @IsEmail()
  @IsOptional()
  readonly email?: string;
  @IsString()
  @IsOptional()
  readonly password?: string;
  @IsString()
  @IsOptional()
  readonly name?: string;
  @IsString()
  @IsOptional()
  readonly tel?: string;
  @IsString()
  @IsOptional()
  readonly role?: string;
  @IsBoolean()
  @IsOptional()
  readonly hasAppointment?: string;
}
