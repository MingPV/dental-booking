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

  @Prop()
  status: string;

  @Prop({ type: Date })
  appointment_date: Date;

  @Prop()
  appointment_time: string;

  @Prop({ type: Date })
  created_at: Date;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
