/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dentist, DentistDocument } from './schemas/dentist.schema';
import { CreateDentistDto } from './dto/create-dentist.dto';
import { UpdateDentistDto } from './dto/update-dentist.dto';

@Injectable()
export class DentistsService {
  constructor(
    @InjectModel(Dentist.name)
    private dentistModel: Model<DentistDocument>,
  ) {}

  async create(createDentistDto: CreateDentistDto): Promise<Dentist> {
    const createdDentist = new this.dentistModel(createDentistDto);
    return createdDentist.save();
  }

  async findAll(): Promise<Dentist[]> {
    return this.dentistModel.find().exec();
  }

  async findOne(id: string): Promise<Dentist> {
    const dentist = await this.dentistModel.findById(id).exec();
    if (!dentist) {
      throw new NotFoundException(`Dentist with ID ${id} not found`);
    }
    return dentist;
  }

  async update(
    id: string,
    updateDentistDto: UpdateDentistDto,
  ): Promise<Dentist> {
    const updatedDentist = await this.dentistModel
      .findByIdAndUpdate(id, updateDentistDto, { new: true })
      .exec();
    if (!updatedDentist) {
      throw new NotFoundException(`Dentist with ID ${id} not found`);
    }
    return updatedDentist;
  }

  async delete(id: string): Promise<{ message: string }> {
    try {
      const result = await this.dentistModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Dentist with ID ${id} not found`);
      }
      return { message: 'Delete Successful' };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred during deletion',
      );
    }
  }
}
