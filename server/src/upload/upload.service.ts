import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { UPLOAD_CONSTANTS, UPLOAD_ERRORS } from './upload.constants';
import { UploadedFileInfo } from './interfaces/upload-options.interface';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly uploadPath: string;

  constructor() {
    this.uploadPath = path.resolve(UPLOAD_CONSTANTS.UPLOAD_DESTINATION);
    this.ensureUploadDirectoryExists();
  }

  private ensureUploadDirectoryExists(): void {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
      this.logger.log(`Created upload directory: ${this.uploadPath}`);
    }
  }

  generateUniqueFilename(originalname: string): string {
    const ext = path.extname(originalname).toLowerCase();
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    return `${randomString}-${timestamp}${ext}`;
  }

  private validateFilename(filename: string): boolean {
    if (
      filename.includes('..') ||
      filename.includes('/') ||
      filename.includes('\\')
    ) {
      return false;
    }

    const ext = path.extname(filename).toLowerCase();
    return UPLOAD_CONSTANTS.ALLOWED_EXTENSIONS.includes(ext);
  }

  processUploadedFile(file: Express.Multer.File): UploadedFileInfo {
    return {
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      url: `/uploads/${file.filename}`,
    };
  }

  processUploadedFiles(files: Express.Multer.File[]): UploadedFileInfo[] {
    return files.map((file) => this.processUploadedFile(file));
  }

  async deleteFile(filename: string): Promise<void> {
    if (!this.validateFilename(filename)) {
      throw new BadRequestException(UPLOAD_ERRORS.INVALID_FILENAME);
    }

    const filePath = path.join(this.uploadPath, filename);

    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(this.uploadPath)) {
      throw new BadRequestException(UPLOAD_ERRORS.INVALID_FILENAME);
    }

    if (!fs.existsSync(filePath)) {
      throw new BadRequestException(UPLOAD_ERRORS.FILE_NOT_FOUND);
    }

    try {
      await fs.promises.unlink(filePath);
      this.logger.log(`Deleted file: ${filename}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${filename}`, error);
      throw new BadRequestException(UPLOAD_ERRORS.FILE_DELETE_FAILED);
    }
  }

  fileExists(filename: string): boolean {
    if (!this.validateFilename(filename)) {
      return false;
    }
    const filePath = path.join(this.uploadPath, filename);
    return fs.existsSync(filePath);
  }
}
