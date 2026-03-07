import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: this.configService.get('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: this.configService.get('SMTP_FROM'),
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error(`Failed to send email to ${options.to}`);
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetLink = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Password Reset</h1>
        <p>You requested a password reset for your account.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p><strong>Important:</strong> This link will expire in 15 minutes for security reasons.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          If the button above doesn't work, copy and paste this link into your browser:<br>
          <a href="${resetLink}">${resetLink}</a>
        </p>
      </div>
    `;

    const text = `
      Password Reset Request
      
      You requested a password reset for your account.
      
      Please visit the following link to reset your password:
      ${resetLink}
      
      Important: This link will expire in 15 minutes for security reasons.
      
      If you didn't request a password reset, you can safely ignore this email.
    `;

    await this.sendEmail({
      to: email,
      subject: 'Password Reset Request',
      html,
      text,
    });
  }

  async sendEmailVerification(email: string, verificationToken: string): Promise<void> {
    const verificationLink = `${this.configService.get('FRONTEND_URL')}/verify-email/${verificationToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Welcome! Please Verify Your Email</h1>
        <p>Thank you for registering with us!</p>
        <p>To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>Once verified, you'll be able to access all features of your account.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          If the button above doesn't work, copy and paste this link into your browser:<br>
          <a href="${verificationLink}">${verificationLink}</a>
        </p>
      </div>
    `;

    const text = `
      Welcome! Please Verify Your Email
      
      Thank you for registering with us!
      
      To complete your registration and activate your account, please verify your email address by visiting:
      ${verificationLink}
      
      Once verified, you'll be able to access all features of your account.
      
      If you didn't create an account, you can safely ignore this email.
    `;

    await this.sendEmail({
      to: email,
      subject: 'Please Verify Your Email Address',
      html,
      text,
    });
  }

  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; text-align: center;">Welcome to Our Platform!</h1>
        <p>Hi ${username},</p>
        <p>Your email has been successfully verified! Welcome to our platform.</p>
        <p>You can now:</p>
        <ul>
          <li>Access your account dashboard</li>
          <li>Explore all available features</li>
          <li>Update your profile settings</li>
        </ul>
        <p>If you have any questions or need assistance, feel free to contact our support team.</p>
        <p>Thank you for joining us!</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `;

    const text = `
      Welcome to Our Platform!
      
      Hi ${username},
      
      Your email has been successfully verified! Welcome to our platform.
      
      You can now:
      - Access your account dashboard
      - Explore all available features
      - Update your profile settings
      
      If you have any questions or need assistance, feel free to contact our support team.
      
      Thank you for joining us!
    `;

    await this.sendEmail({
      to: email,
      subject: 'Welcome to Our Platform!',
      html,
      text,
    });
  }
}
