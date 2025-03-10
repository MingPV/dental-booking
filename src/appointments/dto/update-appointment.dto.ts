import { IsString, IsNumber, IsOptional } from 'class-validator';

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
}
