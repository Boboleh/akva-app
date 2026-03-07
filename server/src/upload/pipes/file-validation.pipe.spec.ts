import { BadRequestException } from '@nestjs/common';
import {
  FileValidationPipe,
  FilesValidationPipe,
} from './file-validation.pipe';
import { UPLOAD_ERRORS } from '../upload.constants';

describe('FileValidationPipe', () => {
  let pipe: FileValidationPipe;

  beforeEach(() => {
    pipe = new FileValidationPipe();
  });

  it('should throw if no file provided', () => {
    expect(() => pipe.transform(null as any)).toThrow(
      new BadRequestException(UPLOAD_ERRORS.NO_FILE_PROVIDED),
    );
  });

  it('should throw if file is undefined', () => {
    expect(() => pipe.transform(undefined as any)).toThrow(
      new BadRequestException(UPLOAD_ERRORS.NO_FILE_PROVIDED),
    );
  });

  it('should throw if file too large', () => {
    const file = {
      size: 11 * 1024 * 1024, // 11 MB
      mimetype: 'image/jpeg',
    } as Express.Multer.File;

    expect(() => pipe.transform(file)).toThrow(
      new BadRequestException(UPLOAD_ERRORS.FILE_TOO_LARGE),
    );
  });

  it('should throw if invalid MIME type - pdf', () => {
    const file = {
      size: 1024,
      mimetype: 'application/pdf',
    } as Express.Multer.File;

    expect(() => pipe.transform(file)).toThrow(
      new BadRequestException(UPLOAD_ERRORS.INVALID_FILE_TYPE),
    );
  });

  it('should throw if invalid MIME type - text', () => {
    const file = {
      size: 1024,
      mimetype: 'text/plain',
    } as Express.Multer.File;

    expect(() => pipe.transform(file)).toThrow(
      new BadRequestException(UPLOAD_ERRORS.INVALID_FILE_TYPE),
    );
  });

  it('should return file for valid JPEG', () => {
    const file = {
      size: 1024,
      mimetype: 'image/jpeg',
    } as Express.Multer.File;

    expect(pipe.transform(file)).toBe(file);
  });

  it('should return file for valid PNG', () => {
    const file = {
      size: 1024,
      mimetype: 'image/png',
    } as Express.Multer.File;

    expect(pipe.transform(file)).toBe(file);
  });

  it('should return file for valid WebP', () => {
    const file = {
      size: 1024,
      mimetype: 'image/webp',
    } as Express.Multer.File;

    expect(pipe.transform(file)).toBe(file);
  });

  it('should return file for valid GIF', () => {
    const file = {
      size: 1024,
      mimetype: 'image/gif',
    } as Express.Multer.File;

    expect(pipe.transform(file)).toBe(file);
  });

  it('should accept file at exact size limit', () => {
    const file = {
      size: 10 * 1024 * 1024, // Exactly 10 MB
      mimetype: 'image/jpeg',
    } as Express.Multer.File;

    expect(pipe.transform(file)).toBe(file);
  });
});

describe('FilesValidationPipe', () => {
  let pipe: FilesValidationPipe;

  beforeEach(() => {
    pipe = new FilesValidationPipe();
  });

  it('should throw if no files provided', () => {
    expect(() => pipe.transform(null as any)).toThrow(
      new BadRequestException(UPLOAD_ERRORS.NO_FILE_PROVIDED),
    );
  });

  it('should throw if empty array provided', () => {
    expect(() => pipe.transform([])).toThrow(
      new BadRequestException(UPLOAD_ERRORS.NO_FILE_PROVIDED),
    );
  });

  it('should validate all files in array', () => {
    const files = [
      { size: 1024, mimetype: 'image/jpeg' },
      { size: 2048, mimetype: 'image/png' },
    ] as Express.Multer.File[];

    const result = pipe.transform(files);
    expect(result).toHaveLength(2);
  });

  it('should throw if any file is invalid', () => {
    const files = [
      { size: 1024, mimetype: 'image/jpeg' },
      { size: 1024, mimetype: 'application/pdf' },
    ] as Express.Multer.File[];

    expect(() => pipe.transform(files)).toThrow(
      new BadRequestException(UPLOAD_ERRORS.INVALID_FILE_TYPE),
    );
  });

  it('should throw if any file is too large', () => {
    const files = [
      { size: 1024, mimetype: 'image/jpeg' },
      { size: 15 * 1024 * 1024, mimetype: 'image/jpeg' },
    ] as Express.Multer.File[];

    expect(() => pipe.transform(files)).toThrow(
      new BadRequestException(UPLOAD_ERRORS.FILE_TOO_LARGE),
    );
  });
});
