/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateDentistDto {
  @IsString()
  @IsOptional()
  readonly name?: string;
  @IsNumber()
  @IsOptional()
  readonly experience?: number;
  @IsString()
  @IsOptional()
  readonly expertiseArea: string;
}
