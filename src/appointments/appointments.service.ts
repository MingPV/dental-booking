/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
    user: any,
  ): Promise<Appointment> {
    if (user.hasAppointment) {
      throw new NotFoundException(`user already has an appointment.`);
    }
    const createdAppointment = new this.appointmentModel(createAppointmentDto);
    return createdAppointment.save();
  }

  async findAll(user: any): Promise<Appointment[]> {
    if (user.role === 'admin') {
      return this.appointmentModel.find(); // Admin เห็นทั้งหมด
    }

    return this.appointmentModel.find({ user_email: user.email }); // User เห็นแค่ของตัวเอง

    // return this.appointmentModel.find().exec();
  }

  async findOne(id: string, user: any): Promise<Appointment> {
    const appointment = await this.appointmentModel.findById(id).exec();
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    if (user.role != 'admin') {
      if (appointment.user_email != user.email) {
        throw new NotFoundException(
          `Appointment with ID ${id} is not your appointment!`,
        );
      }
    }

    return appointment;
  }

  async update(
    id: string,
    user: any,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    if (user.role != 'admin') {
      const appointment = await this.findOne(id, user);
      if (appointment.user_email != user.email) {
        throw new NotFoundException(
          `Appointment with ID ${id} is not your appointment!`,
        );
      }
    }

    const updatedAppointment = await this.appointmentModel
      .findByIdAndUpdate(id, updateAppointmentDto, { new: true })
      .exec();
    if (!updatedAppointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return updatedAppointment;
  }

  // Or you can do the same thing as above just show the example for try catch.
  async delete(id: string, user: any): Promise<{ message: string }> {
    try {
      if (user.role != 'admin') {
        const appointment = await this.findOne(id, user);
        if (appointment.user_email != user.email) {
          throw new NotFoundException(
            `Appointment with ID ${id} is not your appointment!`,
          );
        }
      }
      const result = await this.appointmentModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Appointment with ID ${id} not found`);
      }
      return { message: 'Delete Successful' };
    } catch (error) {
      // Handle or transform the error as needed
      throw new InternalServerErrorException(
        'An error occurred during deletion',
      );
    }
  }
}
