import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import { UploadService } from './upload.service';
import { UPLOAD_ERRORS } from './upload.constants';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  promises: {
    unlink: jest.fn(),
  },
}));

describe('UploadService', () => {
  let service: UploadService;
  const mockExistsSync = fs.existsSync as jest.Mock;
  const mockUnlink = fs.promises.unlink as jest.Mock;

  beforeEach(async () => {
    mockExistsSync.mockReturnValue(true);
    mockUnlink.mockResolvedValue(undefined);

    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadService],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateUniqueFilename', () => {
    it('should generate unique filename with correct extension', () => {
      const result = service.generateUniqueFilename('test-image.jpg');
      expect(result).toMatch(/^[a-f0-9]+-\d+\.jpg$/);
    });

    it('should lowercase extension', () => {
      const result = service.generateUniqueFilename('TEST.PNG');
      expect(result).toMatch(/\.png$/);
    });

    it('should handle webp extension', () => {
      const result = service.generateUniqueFilename('photo.WebP');
      expect(result).toMatch(/\.webp$/);
    });
  });

  describe('processUploadedFile', () => {
    it('should return correct file info', () => {
      const mockFile = {
        filename: 'abc123.jpg',
        originalname: 'my-image.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
        path: './uploads/abc123.jpg',
      } as Express.Multer.File;

      const result = service.processUploadedFile(mockFile);

      expect(result).toEqual({
        filename: 'abc123.jpg',
        originalname: 'my-image.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
        path: './uploads/abc123.jpg',
        url: '/uploads/abc123.jpg',
      });
    });
  });

  describe('processUploadedFiles', () => {
    it('should process multiple files', () => {
      const mockFiles = [
        {
          filename: 'file1.jpg',
          originalname: 'original1.jpg',
          mimetype: 'image/jpeg',
          size: 1024,
          path: './uploads/file1.jpg',
        },
        {
          filename: 'file2.png',
          originalname: 'original2.png',
          mimetype: 'image/png',
          size: 2048,
          path: './uploads/file2.png',
        },
      ] as Express.Multer.File[];

      const result = service.processUploadedFiles(mockFiles);

      expect(result).toHaveLength(2);
      expect(result[0].url).toBe('/uploads/file1.jpg');
      expect(result[1].url).toBe('/uploads/file2.png');
    });
  });

  describe('deleteFile', () => {
    it('should throw BadRequestException for path traversal attempt with ..', async () => {
      await expect(service.deleteFile('../etc/passwd')).rejects.toThrow(
        new BadRequestException(UPLOAD_ERRORS.INVALID_FILENAME),
      );
    });

    it('should throw BadRequestException for path traversal attempt with /', async () => {
      await expect(service.deleteFile('etc/passwd.jpg')).rejects.toThrow(
        new BadRequestException(UPLOAD_ERRORS.INVALID_FILENAME),
      );
    });

    it('should throw BadRequestException for invalid extension', async () => {
      await expect(service.deleteFile('file.exe')).rejects.toThrow(
        new BadRequestException(UPLOAD_ERRORS.INVALID_FILENAME),
      );
    });

    it('should throw BadRequestException for non-existent file', async () => {
      mockExistsSync.mockReturnValue(false);

      await expect(service.deleteFile('nonexistent.jpg')).rejects.toThrow(
        new BadRequestException(UPLOAD_ERRORS.FILE_NOT_FOUND),
      );
    });

    it('should delete file successfully', async () => {
      mockExistsSync.mockReturnValue(true);
      mockUnlink.mockResolvedValue(undefined);

      await expect(
        service.deleteFile('valid-file.jpg'),
      ).resolves.toBeUndefined();
      expect(mockUnlink).toHaveBeenCalled();
    });

    it('should throw BadRequestException when unlink fails', async () => {
      mockExistsSync.mockReturnValue(true);
      mockUnlink.mockRejectedValue(new Error('Permission denied'));

      await expect(service.deleteFile('valid-file.jpg')).rejects.toThrow(
        new BadRequestException(UPLOAD_ERRORS.FILE_DELETE_FAILED),
      );
    });
  });

  describe('fileExists', () => {
    it('should return false for invalid filename with path traversal', () => {
      expect(service.fileExists('../invalid.jpg')).toBe(false);
    });

    it('should return false for invalid extension', () => {
      expect(service.fileExists('file.pdf')).toBe(false);
    });

    it('should return true for existing valid file', () => {
      mockExistsSync.mockReturnValue(true);
      expect(service.fileExists('valid.jpg')).toBe(true);
    });

    it('should return false for non-existing file', () => {
      mockExistsSync.mockReturnValue(false);
      expect(service.fileExists('notfound.jpg')).toBe(false);
    });
  });
});
