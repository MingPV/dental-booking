import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

@Schema()
export class Appointment {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  user_email: string;

  @Prop()
  dentist_id: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
