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
      throw new NotFoundException(`User already has an appointment.`);
    }
    if (user.role != 'admin') {
      if (createAppointmentDto.user_email != user.email) {
        throw new NotFoundException(`You can create only your appointment.`);
      }
    }

    const appointmentDate = new Date(createAppointmentDto.appointment_date);

    const existingAppointment = await this.appointmentModel
      .findOne({
        appointment_date: {
          $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
          $lt: new Date(appointmentDate.setHours(23, 59, 59, 999)),
        },
        appointment_time: createAppointmentDto.appointment_time,
      })
      .exec();

    if (existingAppointment) {
      throw new NotFoundException(
        'This time is not available. Please select another time.',
      );
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

    if (
      updateAppointmentDto.appointment_date &&
      updateAppointmentDto.appointment_time
    ) {
      const appointmentDate = new Date(updateAppointmentDto.appointment_date);

      const existingAppointment = await this.appointmentModel
        .findOne({
          appointment_date: {
            $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
            $lt: new Date(appointmentDate.setHours(23, 59, 59, 999)),
          },
          appointment_time: updateAppointmentDto.appointment_time,
          _id: { $ne: id }, // Exclude the current appointment from the check
        })
        .exec();

      if (existingAppointment) {
        throw new NotFoundException(
          'This time is not available. Please select another time.',
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
