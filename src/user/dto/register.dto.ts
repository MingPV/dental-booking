import {
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsDateString,
} from 'class-validator';

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
  @IsString()
  readonly role: string;
  @IsBoolean()
  readonly hasAppointment: string;
  @IsBoolean()
  @IsOptional()
  readonly isBanned?: boolean;
  @IsDateString()
  @IsOptional()
  readonly banUntil?: Date;
}
