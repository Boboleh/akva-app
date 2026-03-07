import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { USER_EXIST, USER_NOT_FOUND } from './user.constants';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly UserModel: Model<User>) {}

  async create(dto: CreateUserDto) {
    const user = await this.UserModel.findOne({ email: dto.email });
    if (user) {
      throw new BadRequestException(USER_EXIST);
    }
    const password = await this.hashPassword(dto.password);
    delete dto.password;

    // Создаем пользователя с неподтвержденным email
    const newUser = await this.UserModel.create({
      password,
      ...dto,
      emailVerified: false,
    });

    return newUser;
  }

  async findOne(filter: FindUserDto) {
    const user = await this.UserModel.findOne(filter);
    if (!user) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(name: FindUserDto, update: UpdateUserDto) {
    const _update = await this.UserModel.findOneAndUpdate({ username: name }, update).exec();
    if (!_update) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return _update;
  }

  async delete(dto: DeleteUserDto) {
    const user = await this.UserModel.findByIdAndDelete(dto).exec();
    if (!user) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findOneWithoutException(filter: FindUserDto) {
    return this.UserModel.findOne(filter);
  }

  async updateResetToken(email: string, resetToken: string, resetTokenExpires: Date) {
    return this.UserModel.findOneAndUpdate(
      { email },
      {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpires,
      },
      { new: true },
    );
  }

  async findByResetToken(resetToken: string) {
    return this.UserModel.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: new Date() }, // Токен должен быть действительным
    });
  }

  async resetPassword(userId: string, newPassword: string) {
    const hashedPassword = await this.hashPassword(newPassword);
    return this.UserModel.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
      },
      { new: true },
    );
  }

  async hashPassword(password: string) {
    const saltRounds = 10;
    const salt = await genSalt(saltRounds);
    return hash(password, salt);
  }

  async updateEmailVerificationToken(email: string, verificationToken: string) {
    return this.UserModel.findOneAndUpdate(
      { email },
      { emailVerificationToken: verificationToken },
      { new: true },
    );
  }

  async findByEmailVerificationToken(verificationToken: string) {
    return this.UserModel.findOne({
      emailVerificationToken: verificationToken,
    });
  }

  async verifyUserEmail(userId: string) {
    return this.UserModel.findByIdAndUpdate(
      userId,
      {
        emailVerified: true,
        emailVerificationToken: undefined,
      },
      { new: true },
    );
  }
}
