/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    private userService: UserService,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
    user: any,
  ): Promise<Appointment> {
    if (user.role != 'admin') {
      if (createAppointmentDto.user_email != user.email) {
        throw new NotFoundException(`You can create only your appointment.`);
      }
    }

    const userData = await this.userService.findByEmail(user.email);
    if (!userData) {
      throw new NotFoundException(`User with email ${user.email} not found.`);
    }
    if (userData.isBanned) {
      throw new NotFoundException(
        `Your account is locked because you miss 3 appointments in last 6 month. Your account will be unlocked at ${userData.banUntil.toString()}`,
      );
    }
    if (userData.hasAppointment) {
      throw new NotFoundException(`User already has an appointment.`);
    }

    const appointmentDate = new Date(createAppointmentDto.appointment_date);
    const now = new Date();

    // Ensure the date is in the future
    if (appointmentDate < new Date(now.setHours(0, 0, 0, 0))) {
      throw new BadRequestException('Appointment date cannot be in the past.');
    }

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

    console.log(user);

    try {
      const updatedUser = await this.userService.updateAppointmentStatus(
        userData.id,
        true,
      );
    } catch {
      throw new NotFoundException("Can't update user appointment status.");
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
    const appointmentData = await this.findOne(id, user);
    if (!appointmentData) {
      throw new NotFoundException(`Appointment with ID ${id} not found!`);
    }

    if (user.role != 'admin') {
      if (appointmentData.user_email != user.email) {
        throw new NotFoundException(
          `Appointment with ID ${id} is not your appointment!`,
        );
      }
    }

    if (user.role != 'admin') {
      if (!updateAppointmentDto.status) {
        if (
          appointmentData.status == 'accepted' ||
          appointmentData.status == 'completed' ||
          appointmentData.status == 'missed'
        ) {
          throw new NotFoundException(`you can not update appointment now.`);
        }

        if (updateAppointmentDto.price) {
          throw new NotFoundException(
            `Only admin can update appointment price!`,
          );
        }
        if (updateAppointmentDto.user_email) {
          throw new NotFoundException(
            `Only admin can update appointment user_email!`,
          );
        }
        if (updateAppointmentDto.dentist_id) {
          throw new NotFoundException(
            `Only admin can update appointment dentist_id!`,
          );
        }
      } else {
        if (updateAppointmentDto.status != 'cancelled') {
          throw new NotFoundException(`you can not update appointment status.`);
        } else {
          if (updateAppointmentDto.price) {
            throw new NotFoundException(
              `Only admin can update appointment price!`,
            );
          }
          if (updateAppointmentDto.user_email) {
            throw new NotFoundException(
              `Only admin can update appointment user_email!`,
            );
          }
          if (updateAppointmentDto.dentist_id) {
            throw new NotFoundException(
              `Only admin can update appointment dentist_id!`,
            );
          }
          if (updateAppointmentDto.appointment_date) {
            throw new NotFoundException(
              `Only admin can update appointment date before cancel!`,
            );
          }
          if (updateAppointmentDto.appointment_time) {
            throw new NotFoundException(
              `Only admin can update appointment time before cancel!`,
            );
          }
          // check if user cancel the appointment on the same day as the appointment_date
          const today = new Date();
          const appointmentDate = new Date(appointmentData.appointment_date);
          if (
            today.getFullYear() === appointmentDate.getFullYear() &&
            today.getMonth() === appointmentDate.getMonth() &&
            today.getDate() === appointmentDate.getDate()
          ) {
            throw new NotFoundException(
              `You cannot cancel the appointment on the same day as appointment date, Please contact 0888888888.`,
            );
          }
        }
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

    let userData;

    if (
      (updatedAppointment.status == 'completed' ||
        updatedAppointment.status == 'missed' ||
        updatedAppointment.status == 'cancelled') &&
      updateAppointmentDto.status &&
      (updateAppointmentDto.status == 'completed' ||
        updateAppointmentDto.status == 'missed' ||
        updateAppointmentDto.status == 'cancelled')
    ) {
      try {
        userData = await this.userService.findByEmail(
          updatedAppointment.user_email,
        );
        if (userData) {
          const updatedUser = await this.userService.updateAppointmentStatus(
            userData.id,
            false,
          );
        }
      } catch {
        throw new NotFoundException("Can't update user appointment status.");
      }
    }

    if (
      updatedAppointment.status == 'missed' &&
      updateAppointmentDto.status == 'missed'
    ) {
      // Count missed appointments in the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const missedAppointmentsCount =
        await this.appointmentModel.countDocuments({
          user_email: updatedAppointment.user_email,
          status: 'missed',
          appointment_date: { $gte: sixMonthsAgo },
        });

      if (missedAppointmentsCount >= 3) {
        const banUntil = new Date();
        banUntil.setDate(banUntil.getDate() + 30);

        await this.userService.update(userData.id, user, {
          isBanned: true,
          banUntil,
        });
      }
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
      const userData = await this.userService.findByEmail(result.user_email);
      if (result.status == 'pending' || result.status == 'confirmed') {
        if (userData) {
          this.userService.updateAppointmentStatus(userData.id, false);
        }
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
