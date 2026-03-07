import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OtherFields } from './user.schema';

export interface IAuth extends OtherFields {
  userId: string;
  refreshToken: string;
}

export type AuthDocument = HydratedDocument<Auth>;

@Schema({
  timestamps: true,
})
export class Auth {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: string;

  @Prop({
    required: true,
  })
  refreshToken: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
