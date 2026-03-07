import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockUser = {
    id: 'user-id',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: 'user',
  };

  const mockUserService = {
    findOne: jest.fn(),
    findOneWithoutException: jest.fn(),
    updateResetToken: jest.fn(),
    findByResetToken: jest.fn(),
    resetPassword: jest.fn(),
    findByEmailVerificationToken: jest.fn(),
    verifyUserEmail: jest.fn(),
  };

  const mockEmailService = {
    sendPasswordResetEmail: jest.fn(),
    sendEmailVerification: jest.fn(),
    sendWelcomeEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return tokens on successful login', async () => {
      const loginDto = { login: 'test@example.com', password: 'password123' };
      const expectedAccessToken = 'access-token';
      const expectedRefreshToken = 'refresh-token';

      mockUserService.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync
        .mockResolvedValueOnce(expectedAccessToken)
        .mockResolvedValueOnce(expectedRefreshToken);
      mockConfigService.get
        .mockReturnValueOnce(3600000) // ACCESS_TOKEN_EXP
        .mockReturnValueOnce('access-secret') // ACCESS_TOKEN_SECRET
        .mockReturnValueOnce(7200000) // REFRESH_TOKEN_EXP
        .mockReturnValueOnce('refresh-secret'); // REFRESH_TOKEN_SECRET

      const result = await authService.login(loginDto);

      expect(mockUserService.findOne).toHaveBeenCalledWith({ email: loginDto.login });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(result).toEqual({
        accessToken: expectedAccessToken,
        refreshToken: expectedRefreshToken,
      });
    });

    it('should throw BadRequestException when user not found', async () => {
      const loginDto = { login: 'nonexistent@example.com', password: 'password123' };

      mockUserService.findOne.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(BadRequestException);
      expect(mockUserService.findOne).toHaveBeenCalledWith({ email: loginDto.login });
    });

    it('should throw BadRequestException when password is incorrect', async () => {
      const loginDto = { login: 'test@example.com', password: 'wrongpassword' };

      mockUserService.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(BadRequestException);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
    });
  });

  describe('forgotPassword', () => {
    it('should send reset email for existing user', async () => {
      const forgotPasswordDto = { email: 'test@example.com' };
      const mockResetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

      mockUserService.findOneWithoutException.mockResolvedValue(mockUser);
      mockUserService.updateResetToken.mockResolvedValue(mockUser);
      mockEmailService.sendPasswordResetEmail.mockResolvedValue(undefined);

      // Mock crypto.randomBytes
      jest
        .spyOn(require('crypto'), 'randomBytes')
        .mockReturnValue(Buffer.from('mockedresettoken'.padEnd(32, '0')));

      const result = await authService.forgotPassword(forgotPasswordDto);

      expect(mockUserService.findOneWithoutException).toHaveBeenCalledWith({
        email: forgotPasswordDto.email,
      });
      expect(mockUserService.updateResetToken).toHaveBeenCalledWith(
        forgotPasswordDto.email,
        expect.any(String),
        expect.any(Date),
      );
      expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        forgotPasswordDto.email,
        expect.any(String),
      );
      expect(result).toEqual({
        message: 'Password reset email sent successfully',
        email: forgotPasswordDto.email,
      });
    });

    it('should return success message for non-existing user (security)', async () => {
      const forgotPasswordDto = { email: 'nonexistent@example.com' };

      mockUserService.findOneWithoutException.mockResolvedValue(null);

      const result = await authService.forgotPassword(forgotPasswordDto);

      expect(mockUserService.findOneWithoutException).toHaveBeenCalledWith({
        email: forgotPasswordDto.email,
      });
      expect(mockUserService.updateResetToken).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Password reset email sent successfully',
        email: forgotPasswordDto.email,
      });
    });

    it('should return success message on error (security)', async () => {
      const forgotPasswordDto = { email: 'test@example.com' };

      mockUserService.findOneWithoutException.mockRejectedValue(new Error('Database error'));

      const result = await authService.forgotPassword(forgotPasswordDto);

      expect(result).toEqual({
        message: 'Password reset email sent successfully',
        email: forgotPasswordDto.email,
      });
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully with valid token', async () => {
      const resetPasswordDto = { token: 'valid-reset-token', newPassword: 'newPassword123' };
      const mockUserWithId = { ...mockUser, _id: { toString: () => 'user-id' } };

      mockUserService.findByResetToken.mockResolvedValue(mockUserWithId);
      mockUserService.resetPassword.mockResolvedValue(mockUserWithId);

      const result = await authService.resetPassword(resetPasswordDto);

      expect(mockUserService.findByResetToken).toHaveBeenCalledWith(resetPasswordDto.token);
      expect(mockUserService.resetPassword).toHaveBeenCalledWith(
        'user-id',
        resetPasswordDto.newPassword,
      );
      expect(result).toEqual({
        message: 'Password reset successfully',
      });
    });

    it('should throw BadRequestException for invalid token', async () => {
      const resetPasswordDto = { token: 'invalid-token', newPassword: 'newPassword123' };

      mockUserService.findByResetToken.mockResolvedValue(null);

      await expect(authService.resetPassword(resetPasswordDto)).rejects.toThrow(
        new BadRequestException('Invalid or expired reset token'),
      );
      expect(mockUserService.findByResetToken).toHaveBeenCalledWith(resetPasswordDto.token);
      expect(mockUserService.resetPassword).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for expired token', async () => {
      const resetPasswordDto = { token: 'expired-token', newPassword: 'newPassword123' };

      mockUserService.findByResetToken.mockResolvedValue(null); // Expired tokens return null

      await expect(authService.resetPassword(resetPasswordDto)).rejects.toThrow(
        new BadRequestException('Invalid or expired reset token'),
      );
    });

    it('should throw BadRequestException on database error', async () => {
      const resetPasswordDto = { token: 'valid-token', newPassword: 'newPassword123' };

      mockUserService.findByResetToken.mockRejectedValue(new Error('Database error'));

      await expect(authService.resetPassword(resetPasswordDto)).rejects.toThrow(
        new BadRequestException('Invalid or expired reset token'),
      );
    });
  });

  describe('refresh', () => {
    it('should refresh tokens successfully with valid refresh token', async () => {
      const refreshTokenDto = { refreshToken: 'valid-refresh-token' };
      const payload = { id: 'user-id', name: 'testuser', email: 'test@example.com' };
      const expectedAccessToken = 'new-access-token';
      const expectedRefreshToken = 'new-refresh-token';

      mockJwtService.verifyAsync.mockResolvedValue(payload);
      mockUserService.findOne.mockResolvedValue(mockUser);
      mockJwtService.signAsync
        .mockResolvedValueOnce(expectedAccessToken)
        .mockResolvedValueOnce(expectedRefreshToken);
      mockConfigService.get
        .mockReturnValueOnce('refresh-secret')
        .mockReturnValueOnce(3600000) // ACCESS_TOKEN_EXP
        .mockReturnValueOnce('access-secret') // ACCESS_TOKEN_SECRET
        .mockReturnValueOnce(7200000) // REFRESH_TOKEN_EXP
        .mockReturnValueOnce('refresh-secret'); // REFRESH_TOKEN_SECRET

      const result = await authService.refresh(refreshTokenDto);

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(refreshTokenDto.refreshToken, {
        secret: 'refresh-secret',
      });
      expect(mockUserService.findOne).toHaveBeenCalledWith({ email: payload.email });
      expect(authService.isTokenBlacklisted(refreshTokenDto.refreshToken)).toBe(true);
      expect(result).toEqual({
        accessToken: expectedAccessToken,
        refreshToken: expectedRefreshToken,
      });
    });

    it('should throw UnauthorizedException when refresh token is blacklisted', async () => {
      const refreshTokenDto = { refreshToken: 'blacklisted-token' };

      // Добавляем токен в черный список
      const mockRequest = {
        headers: {
          authorization: `Bearer ${refreshTokenDto.refreshToken}`,
        },
      } as any;
      await authService.logout(mockRequest);

      await expect(authService.refresh(refreshTokenDto)).rejects.toThrow(
        new UnauthorizedException('Refresh token has been revoked'),
      );
    });

    it('should throw UnauthorizedException when refresh token is expired', async () => {
      const refreshTokenDto = { refreshToken: 'expired-token' };
      const error = new Error('Token expired');
      error.name = 'TokenExpiredError';

      mockJwtService.verifyAsync.mockRejectedValue(error);

      await expect(authService.refresh(refreshTokenDto)).rejects.toThrow(
        new UnauthorizedException('Refresh token expired'),
      );
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      const refreshTokenDto = { refreshToken: 'invalid-token' };
      const error = new Error('Invalid token');
      error.name = 'JsonWebTokenError';

      mockJwtService.verifyAsync.mockRejectedValue(error);

      await expect(authService.refresh(refreshTokenDto)).rejects.toThrow(
        new UnauthorizedException('Invalid refresh token'),
      );
    });

    it('should throw UnauthorizedException when user not found', async () => {
      const refreshTokenDto = { refreshToken: 'valid-refresh-token' };
      const payload = { id: 'non-existent-user-id' };

      mockJwtService.verifyAsync.mockResolvedValue(payload);
      mockUserService.findOne.mockResolvedValue(null);
      mockConfigService.get.mockReturnValue('refresh-secret');

      await expect(authService.refresh(refreshTokenDto)).rejects.toThrow(
        new UnauthorizedException('User not found'),
      );
    });
  });

  describe('logout', () => {
    it('should add token to blacklist and return success message', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-jwt-token',
        },
      } as any;

      const result = await authService.logout(mockRequest);

      expect(result).toEqual({
        message: 'Logout successful',
      });
      expect(authService.isTokenBlacklisted('valid-jwt-token')).toBe(true);
    });

    it('should return success message even without token', async () => {
      const mockRequest = {
        headers: {},
      } as any;

      const result = await authService.logout(mockRequest);

      expect(result).toEqual({
        message: 'Logout successful',
      });
    });
  });

  describe('isTokenBlacklisted', () => {
    it('should return true for blacklisted token', () => {
      const token = 'test-token';
      const mockRequest = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      } as any;

      authService.logout(mockRequest);

      expect(authService.isTokenBlacklisted(token)).toBe(true);
    });

    it('should return false for non-blacklisted token', () => {
      expect(authService.isTokenBlacklisted('non-blacklisted-token')).toBe(false);
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully with valid token', async () => {
      const verificationToken = 'valid-verification-token';
      const mockUserWithId = {
        ...mockUser,
        _id: { toString: () => 'user-id' },
        emailVerified: false,
      };

      mockUserService.findByEmailVerificationToken.mockResolvedValue(mockUserWithId);
      mockUserService.verifyUserEmail.mockResolvedValue({
        ...mockUserWithId,
        emailVerified: true,
      });
      mockEmailService.sendWelcomeEmail.mockResolvedValue(undefined);

      const result = await authService.verifyEmail(verificationToken);

      expect(mockUserService.findByEmailVerificationToken).toHaveBeenCalledWith(verificationToken);
      expect(mockUserService.verifyUserEmail).toHaveBeenCalledWith('user-id');
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith(
        mockUserWithId.email,
        mockUserWithId.username,
      );
      expect(result).toEqual({
        message: 'Email verified successfully',
      });
    });

    it('should return message for already verified email', async () => {
      const verificationToken = 'valid-verification-token';
      const mockUserWithId = {
        ...mockUser,
        _id: { toString: () => 'user-id' },
        emailVerified: true,
      };

      mockUserService.findByEmailVerificationToken.mockResolvedValue(mockUserWithId);

      const result = await authService.verifyEmail(verificationToken);

      expect(mockUserService.findByEmailVerificationToken).toHaveBeenCalledWith(verificationToken);
      expect(mockUserService.verifyUserEmail).not.toHaveBeenCalled();
      expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Email already verified',
      });
    });

    it('should throw BadRequestException for invalid token', async () => {
      const verificationToken = 'invalid-token';

      mockUserService.findByEmailVerificationToken.mockResolvedValue(null);

      await expect(authService.verifyEmail(verificationToken)).rejects.toThrow(
        new BadRequestException('Invalid or expired verification token'),
      );
      expect(mockUserService.findByEmailVerificationToken).toHaveBeenCalledWith(verificationToken);
      expect(mockUserService.verifyUserEmail).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException on database error', async () => {
      const verificationToken = 'valid-token';

      mockUserService.findByEmailVerificationToken.mockRejectedValue(new Error('Database error'));

      await expect(authService.verifyEmail(verificationToken)).rejects.toThrow(
        new BadRequestException('Invalid or expired verification token'),
      );
    });
  });
});
