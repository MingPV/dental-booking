import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDate,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsNumber()
  readonly price: number;

  @IsString()
  readonly user_email: string;

  @IsString()
  readonly dentist_id: string;

  @IsString()
  readonly status: string;

  @IsDateString()
  readonly appointment_date: Date;

  @IsString()
  readonly appointment_time: string;

  @IsDate()
  @IsOptional()
  readonly created_at: Date = new Date();
}
