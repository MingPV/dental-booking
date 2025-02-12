import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DentistsService } from './dentists.service';
import { CreateDentistDto } from './dto/create-dentist.dto';
import { UpdateDentistDto } from './dto/update-dentist.dto';

@Controller('dentists')
export class DentistsController {
  constructor(private readonly dentistsService: DentistsService) {}

  @Post()
  create(@Body() createDentistDto: CreateDentistDto) {
    return this.dentistsService.create(createDentistDto);
  }

  @Get()
  findAll() {
    return this.dentistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dentistsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDentistDto: UpdateDentistDto) {
    return this.dentistsService.update(id, updateDentistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dentistsService.delete(id);
  }
}
