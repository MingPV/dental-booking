import { IsString, IsNumber } from 'class-validator';

export class CreateDentistDto {
  @IsString()
  readonly name: string;
  @IsNumber()
  readonly experience: number;
  @IsString()
  readonly expertiseArea: string;
}
