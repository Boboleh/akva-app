import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

// Mock nodemailer
const mockSendMail = jest.fn();
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: mockSendMail,
  })),
}));

describe('EmailService', () => {
  let emailService: EmailService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);

    // Setup default config values
    mockConfigService.get.mockImplementation((key: string) => {
      const config = {
        SMTP_HOST: 'smtp.test.com',
        SMTP_PORT: 587,
        SMTP_SECURE: 'false',
        SMTP_USER: 'test@test.com',
        SMTP_PASS: 'testpass',
        SMTP_FROM: 'Test App <test@test.com>',
        FRONTEND_URL: 'http://localhost:3000',
      };
      return config[key];
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });

      const emailOptions = {
        to: 'recipient@test.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>',
        text: 'Test text',
      };

      await emailService.sendEmail(emailOptions);

      expect(mockSendMail).toHaveBeenCalledWith({
        from: 'Test App <test@test.com>',
        to: 'recipient@test.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>',
        text: 'Test text',
      });
    });

    it('should throw error when email sending fails', async () => {
      mockSendMail.mockRejectedValue(new Error('SMTP Error'));

      const emailOptions = {
        to: 'recipient@test.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>',
      };

      await expect(emailService.sendEmail(emailOptions)).rejects.toThrow(
        'Failed to send email to recipient@test.com',
      );
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email with correct content', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });

      const email = 'user@test.com';
      const resetToken = 'test-reset-token';

      await emailService.sendPasswordResetEmail(email, resetToken);

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'Test App <test@test.com>',
          to: email,
          subject: 'Password Reset Request',
          html: expect.stringContaining(
            'http://localhost:3000/reset-password?token=test-reset-token',
          ),
          text: expect.stringContaining(
            'http://localhost:3000/reset-password?token=test-reset-token',
          ),
        }),
      );
    });
  });

  describe('sendEmailVerification', () => {
    it('should send email verification with correct content', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });

      const email = 'user@test.com';
      const verificationToken = 'test-verification-token';

      await emailService.sendEmailVerification(email, verificationToken);

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'Test App <test@test.com>',
          to: email,
          subject: 'Please Verify Your Email Address',
          html: expect.stringContaining(
            'http://localhost:3000/verify-email/test-verification-token',
          ),
          text: expect.stringContaining(
            'http://localhost:3000/verify-email/test-verification-token',
          ),
        }),
      );
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email with username', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });

      const email = 'user@test.com';
      const username = 'testuser';

      await emailService.sendWelcomeEmail(email, username);

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'Test App <test@test.com>',
          to: email,
          subject: 'Welcome to Our Platform!',
          html: expect.stringContaining('Hi testuser'),
          text: expect.stringContaining('Hi testuser'),
        }),
      );
    });
  });
});
