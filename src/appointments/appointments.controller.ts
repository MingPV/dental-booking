/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
  Query,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto, @Request() req) {
    return this.appointmentsService.create(createAppointmentDto, req.user);
  }

  @Get('verify-delete')
  verifyDelete(
    @Query('token') token: string,
    @Query('appointmentId') appointmentId: string,
  ) {
    // Handle the normal logic for valid appointmentId
    return this.appointmentsService.verifyDeleteAppointment(
      token,
      appointmentId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Request() req) {
    return this.appointmentsService.findAll(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.appointmentsService.findOne(id, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, req.user, updateAppointmentDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  requestDelete(@Param('id') id: string, @Request() req) {
    if (req.user.role == 'admin') {
      return this.appointmentsService.delete(id, req.user);
    }
    return this.appointmentsService.requestDeleteAppointment(id, req.user);
  }
}
