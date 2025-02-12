import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DentistsService } from './dentists.service';
import { DentistsController } from './dentists.controller';
import { Dentist, DentistSchema } from './schemas/dentist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Dentist.name,
        schema: DentistSchema,
      },
    ]),
  ],
  controllers: [DentistsController],
  providers: [DentistsService],
})
export class DentistsModule {}
