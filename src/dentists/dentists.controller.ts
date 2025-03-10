import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DentistsService } from './dentists.service';
import { CreateDentistDto } from './dto/create-dentist.dto';
import { UpdateDentistDto } from './dto/update-dentist.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles-guard';
import { Roles } from 'src/auth/roles.decorators';

@Controller('dentists')
export class DentistsController {
  constructor(private readonly dentistsService: DentistsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateDentistDto: UpdateDentistDto,
  ) {
    return this.dentistsService.update(id, updateDentistDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dentistsService.delete(id);
  }
}
