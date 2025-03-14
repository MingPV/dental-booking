/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema'; // Import UserDocument

import { RegisterDTO } from './dto/register.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {} // Use UserDocument type

  async create(registerDTO: RegisterDTO): Promise<User> {
    const newUser = new this.userModel(registerDTO);
    return await newUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findOneByToken(token: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ twoFactorToken: token }).exec();
    if (!user) {
      throw new NotFoundException(`User with token ${token} not found`);
    }
    return user;
  }

  async updateAppointmentStatus(
    userId: string,
    status: boolean,
  ): Promise<UserDocument | null> {
    return await this.userModel
      .findByIdAndUpdate(userId, { hasAppointment: status }, { new: true })
      .exec();
  }

  async update(
    id: string,
    user: any,
    updateUserDto: UpdateUserDTO,
  ): Promise<UserDocument> {
    if (user.role != 'admin') {
      const userData = await this.findByEmail(user.email);
      if (userData?.email != user.email) {
        throw new NotFoundException(`You can edit only your user.`);
      }
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return updatedUser;
  }
}
