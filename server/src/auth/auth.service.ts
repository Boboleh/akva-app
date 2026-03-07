import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import { Request } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private blacklistedTokens = new Set<string>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async login(filter: LoginDto) {
    const user = await this.userService.findOne({ email: filter.login });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const passwordMatch = await compare(filter.password, user.password);
    if (!passwordMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    return this.createTokens({
      id: user.id,
      name: user.username,
      email: user.email,
      role: user.role,
    });
  }
  private async createTokens(payload: Record<string, any>) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get('ACCESS_TOKEN_EXP') / 1000,
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get('REFRESH_TOKEN_EXP') / 1000,
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    try {
      // Ищем пользователя по email
      const user = await this.userService.findOneWithoutException({ email: dto.email });

      // Если пользователь не найден, возвращаем успешный ответ для безопасности
      // (не раскрываем информацию о том, что email не существует)
      if (!user) {
        return {
          message: 'Password reset email sent successfully',
          email: dto.email,
        };
      }

      // Генерируем reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 минут

      // Сохраняем токен в базе данных
      await this.userService.updateResetToken(user.email, resetToken, resetTokenExpires);

      // Отправляем email с reset ссылкой
      try {
        await this.emailService.sendPasswordResetEmail(user.email, resetToken);
        console.log(`Password reset email sent to ${dto.email}`);
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        // Продолжаем выполнение, не раскрывая ошибку пользователю
      }

      return {
        message: 'Password reset email sent successfully',
        email: dto.email,
      };
    } catch (error) {
      // В случае ошибки также возвращаем успешный ответ для безопасности
      return {
        message: 'Password reset email sent successfully',
        email: dto.email,
      };
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      // Ищем пользователя по reset токену
      const user = await this.userService.findByResetToken(dto.token);

      if (!user) {
        throw new BadRequestException('Invalid or expired reset token');
      }

      // Сбрасываем пароль и очищаем reset токен
      await this.userService.resetPassword(user._id.toString(), dto.newPassword);

      console.log(`Password successfully reset for user: ${user.email}`);

      return {
        message: 'Password reset successfully',
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  async refresh(dto: RefreshTokenDto) {
    try {
      // Проверяем, что refresh токен не в черном списке
      if (this.isTokenBlacklisted(dto.refreshToken)) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }

      // Верифицируем refresh токен
      const payload = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });

      // Получаем пользователя для создания новых токенов
      const user = await this.userService.findOne({ email: payload.email });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Добавляем старый refresh токен в черный список
      this.blacklistedTokens.add(dto.refreshToken);

      // Создаем новые токены
      return this.createTokens({
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
      });
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Refresh token expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid refresh token');
      }
      throw error;
    }
  }

  async logout(req: Request) {
    const token = this.extractTokenFromRequest(req);
    if (token) {
      this.blacklistedTokens.add(token);
    }

    return {
      message: 'Logout successful',
    };
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }

  async verifyEmail(token: string) {
    try {
      // Ищем пользователя по verification токену
      const user = await this.userService.findByEmailVerificationToken(token);

      if (!user) {
        throw new BadRequestException('Invalid or expired verification token');
      }

      // Проверяем, не подтвержден ли уже email
      if (user.emailVerified) {
        return {
          message: 'Email already verified',
        };
      }

      // Подтверждаем email и очищаем токен
      await this.userService.verifyUserEmail(user._id.toString());

      // Отправляем приветственное письмо
      try {
        await this.emailService.sendWelcomeEmail(user.email, user.username);
        console.log(`Welcome email sent to ${user.email}`);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Продолжаем выполнение, не раскрывая ошибку пользователю
      }

      console.log(`Email successfully verified for user: ${user.email}`);

      return {
        message: 'Email verified successfully',
      };
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid or expired verification token');
    }
  }

  private extractTokenFromRequest(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  }

  async sendEmailVerification(email: string, verificationToken: string): Promise<void> {
    await this.emailService.sendEmailVerification(email, verificationToken);
  }
}
