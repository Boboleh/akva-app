import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserService', () => {
  let userService: UserService;
  let userModel: Model<User>;

  const mockUser = {
    _id: 'user-id',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
  };

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    find: jest.fn(),
    findOneAndUpdate: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      };
      const hashedPassword = 'hashed-password';

      mockUserModel.findOne.mockResolvedValue(null);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserModel.create.mockResolvedValue({
        ...createUserDto,
        password: hashedPassword,
        _id: 'new-user-id',
      });

      const result = await userService.create(createUserDto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: createUserDto.email });
      expect(mockUserModel.create).toHaveBeenCalledWith({
        password: hashedPassword,
        username: createUserDto.username,
        email: createUserDto.email,
        emailVerified: false,
      });
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException when user already exists', async () => {
      const createUserDto = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123',
      };

      mockUserModel.findOne.mockResolvedValue(mockUser);

      await expect(userService.create(createUserDto)).rejects.toThrow(BadRequestException);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: createUserDto.email });
    });
  });

  describe('findOne', () => {
    it('should find and return user', async () => {
      const filter = { email: 'test@example.com' };
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await userService.findOne(filter);

      expect(mockUserModel.findOne).toHaveBeenCalledWith(filter);
      expect(result).toEqual(mockUser);
    });

    it('should throw HttpException when user not found', async () => {
      const filter = { email: 'nonexistent@example.com' };
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(userService.findOne(filter)).rejects.toThrow(HttpException);
      expect(mockUserModel.findOne).toHaveBeenCalledWith(filter);
    });
  });

  describe('hashPassword', () => {
    it('should hash password successfully', async () => {
      const password = 'password123';
      const salt = 'salt';
      const hashedPassword = 'hashed-password';

      (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await userService.hashPassword(password);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
      expect(result).toBe(hashedPassword);
    });
  });

  describe('findOneWithoutException', () => {
    it('should find and return user without throwing exception', async () => {
      const filter = { email: 'test@example.com' };
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await userService.findOneWithoutException(filter);

      expect(mockUserModel.findOne).toHaveBeenCalledWith(filter);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      const filter = { email: 'nonexistent@example.com' };
      mockUserModel.findOne.mockResolvedValue(null);

      const result = await userService.findOneWithoutException(filter);

      expect(mockUserModel.findOne).toHaveBeenCalledWith(filter);
      expect(result).toBeNull();
    });
  });

  describe('updateResetToken', () => {
    it('should update reset token successfully', async () => {
      const email = 'test@example.com';
      const resetToken = 'reset-token-123';
      const resetTokenExpires = new Date();
      const updatedUser = {
        ...mockUser,
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpires,
      };

      mockUserModel.findOneAndUpdate.mockResolvedValue(updatedUser);

      const result = await userService.updateResetToken(email, resetToken, resetTokenExpires);

      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { email },
        {
          resetPasswordToken: resetToken,
          resetPasswordExpires: resetTokenExpires,
        },
        { new: true },
      );
      expect(result).toEqual(updatedUser);
    });
  });

  describe('findByResetToken', () => {
    it('should find user by valid reset token', async () => {
      const resetToken = 'valid-reset-token';
      const currentDate = new Date();

      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await userService.findByResetToken(resetToken);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: expect.any(Date) },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null for invalid or expired token', async () => {
      const resetToken = 'invalid-or-expired-token';

      mockUserModel.findOne.mockResolvedValue(null);

      const result = await userService.findByResetToken(resetToken);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: expect.any(Date) },
      });
      expect(result).toBeNull();
    });
  });

  describe('resetPassword', () => {
    it('should reset password and clear reset token', async () => {
      const userId = 'user-id';
      const newPassword = 'newPassword123';
      const hashedPassword = 'hashed-new-password';
      const updatedUser = { ...mockUser, password: hashedPassword };

      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserModel.findByIdAndUpdate.mockResolvedValue(updatedUser);

      const result = await userService.resetPassword(userId, newPassword);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 'salt');
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        {
          password: hashedPassword,
          resetPasswordToken: undefined,
          resetPasswordExpires: undefined,
        },
        { new: true },
      );
      expect(result).toEqual(updatedUser);
    });
  });

  describe('updateEmailVerificationToken', () => {
    it('should update email verification token successfully', async () => {
      const email = 'test@example.com';
      const verificationToken = 'verification-token-123';
      const updatedUser = {
        ...mockUser,
        emailVerificationToken: verificationToken,
      };

      mockUserModel.findOneAndUpdate.mockResolvedValue(updatedUser);

      const result = await userService.updateEmailVerificationToken(email, verificationToken);

      expect(mockUserModel.findOneAndUpdate).toHaveBeenCalledWith(
        { email },
        { emailVerificationToken: verificationToken },
        { new: true },
      );
      expect(result).toEqual(updatedUser);
    });
  });

  describe('findByEmailVerificationToken', () => {
    it('should find user by email verification token', async () => {
      const verificationToken = 'valid-verification-token';

      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await userService.findByEmailVerificationToken(verificationToken);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        emailVerificationToken: verificationToken,
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null for invalid verification token', async () => {
      const verificationToken = 'invalid-verification-token';

      mockUserModel.findOne.mockResolvedValue(null);

      const result = await userService.findByEmailVerificationToken(verificationToken);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        emailVerificationToken: verificationToken,
      });
      expect(result).toBeNull();
    });
  });

  describe('verifyUserEmail', () => {
    it('should verify user email and clear verification token', async () => {
      const userId = 'user-id';
      const updatedUser = {
        ...mockUser,
        emailVerified: true,
        emailVerificationToken: undefined,
      };

      mockUserModel.findByIdAndUpdate.mockResolvedValue(updatedUser);

      const result = await userService.verifyUserEmail(userId);

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        {
          emailVerified: true,
          emailVerificationToken: undefined,
        },
        { new: true },
      );
      expect(result).toEqual(updatedUser);
    });
  });
});
