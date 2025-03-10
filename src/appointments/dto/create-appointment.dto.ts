import { IsString, IsNumber, IsOptional } from 'class-validator';

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
}
