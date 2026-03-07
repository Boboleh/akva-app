import {
  Controller,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as crypto from 'crypto';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UPLOAD_CONSTANTS, UPLOAD_ERRORS } from './upload.constants';
import { FileValidationPipe, FilesValidationPipe } from './pipes/file-validation.pipe';
import { UploadResponseDto } from './dto/upload-response.dto';
import { UploadMultipleResponseDto } from './dto/upload-multiple-response.dto';

const multerOptions = {
  storage: diskStorage({
    destination: UPLOAD_CONSTANTS.UPLOAD_DESTINATION,
    filename: (req, file, callback) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const timestamp = Date.now();
      const randomString = crypto.randomBytes(8).toString('hex');
      callback(null, `${randomString}-${timestamp}${ext}`);
    },
  }),
  limits: {
    fileSize: UPLOAD_CONSTANTS.MAX_FILE_SIZE,
  },
  fileFilter: (req, file, callback) => {
    if (UPLOAD_CONSTANTS.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error(UPLOAD_ERRORS.INVALID_FILE_TYPE), false);
    }
  },
};

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('single')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a single image file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (JPEG, PNG, WebP, GIF, max 10MB)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: UploadResponseDto })
  uploadSingle(@UploadedFile(FileValidationPipe) file: Express.Multer.File): UploadResponseDto {
    return this.uploadService.processUploadedFile(file);
  }

  @Post('multiple')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FilesInterceptor('files', UPLOAD_CONSTANTS.MAX_FILES_COUNT, multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload multiple image files (max 10 files)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Image files (JPEG, PNG, WebP, GIF, max 10MB each)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: UploadMultipleResponseDto })
  uploadMultiple(
    @UploadedFiles(FilesValidationPipe) files: Express.Multer.File[],
  ): UploadMultipleResponseDto {
    const filesInfo = this.uploadService.processUploadedFiles(files);
    return {
      files: filesInfo,
      count: filesInfo.length,
    };
  }

  @Delete(':filename')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an uploaded file' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'File not found or invalid filename',
  })
  async deleteFile(@Param('filename') filename: string): Promise<{ message: string }> {
    await this.uploadService.deleteFile(filename);
    return { message: 'File deleted successfully' };
  }
}
