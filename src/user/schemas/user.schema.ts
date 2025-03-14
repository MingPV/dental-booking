import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  tel: string;

  @Prop()
  role: string;

  @Prop()
  hasAppointment: boolean;

  @Prop()
  isBanned: boolean;

  @Prop()
  banUntil: Date;

  @Prop({ type: String, default: null }) // Store 2FA token
  twoFactorToken: string | null;

  @Prop({ type: Date, default: null }) // Expiration time for token
  twoFactorExpires: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
