/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  readonly name: string;
  @IsString()
  @IsOptional()
  readonly description?: string;
  @IsNumber()
  readonly price: number;
}
