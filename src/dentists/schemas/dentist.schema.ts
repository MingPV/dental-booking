import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DentistDocument = Dentist & Document;

@Schema()
export class Dentist {
  @Prop({ required: true })
  name: string;

  @Prop()
  experience: number;

  @Prop()
  expertiseArea: string;
}

export const DentistSchema = SchemaFactory.createForClass(Dentist);
