import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { UPLOAD_CONSTANTS, UPLOAD_ERRORS } from '../upload.constants';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException(UPLOAD_ERRORS.NO_FILE_PROVIDED);
    }

    if (file.size > UPLOAD_CONSTANTS.MAX_FILE_SIZE) {
      throw new BadRequestException(UPLOAD_ERRORS.FILE_TOO_LARGE);
    }

    if (!UPLOAD_CONSTANTS.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(UPLOAD_ERRORS.INVALID_FILE_TYPE);
    }

    return file;
  }
}

@Injectable()
export class FilesValidationPipe implements PipeTransform {
  transform(files: Express.Multer.File[]): Express.Multer.File[] {
    if (!files || files.length === 0) {
      throw new BadRequestException(UPLOAD_ERRORS.NO_FILE_PROVIDED);
    }

    const fileValidationPipe = new FileValidationPipe();
    return files.map((file) => fileValidationPipe.transform(file));
  }
}
