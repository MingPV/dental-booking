import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDate,
} from 'class-validator';

export class UpdateAppointmentDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsNumber()
  @IsOptional()
  readonly price?: number;

  @IsString()
  @IsOptional()
  readonly user_email?: string;

  @IsString()
  @IsOptional()
  readonly dentist_id?: string;

  @IsString()
  @IsOptional()
  readonly status?: string;

  @IsDateString()
  @IsOptional()
  readonly appointment_date?: Date;

  @IsString()
  @IsOptional()
  readonly appointment_time: string;

  @IsDate()
  @IsOptional()
  readonly created_at?: Date;
}
