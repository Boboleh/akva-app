import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum UserRole {
  AdminUser = 'AdminUser',
  User = 'user',
}

export interface OtherFields {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends OtherFields {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  emailVerificationToken?: string;
  emailVerified: boolean;
}

export interface AuthUser extends Pick<User, 'role' | 'email'> {
  name: string;
}

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User implements Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
  @Prop({
    required: true,
  })
  username: string;

  @Prop({
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    default: UserRole.User,
    enum: UserRole,
    type: String,
    required: true,
  })
  role: UserRole;

  @Prop({
    required: false,
  })
  resetPasswordToken?: string;

  @Prop({
    required: false,
  })
  resetPasswordExpires?: Date;

  @Prop({
    required: false,
  })
  emailVerificationToken?: string;

  @Prop({
    default: false,
    required: true,
  })
  emailVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     const salt = await genSalt(10)
//     const passwordHash = await hash(this.password, salt)
//     this.set('password', passwordHash)
//   }
//   next()
// })
