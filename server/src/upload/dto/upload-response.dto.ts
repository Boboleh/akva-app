import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({
    description: 'Generated unique filename',
    example: 'abc123def456-1699123456789.jpg',
  })
  filename: string;

  @ApiProperty({
    description: 'Original filename',
    example: 'my-image.jpg',
  })
  originalName: string;

  @ApiProperty({
    description: 'File MIME type',
    example: 'image/jpeg',
  })
  mimetype: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 102400,
  })
  size: number;

  @ApiProperty({
    description: 'Relative URL path to access the file',
    example: '/uploads/abc123def456-1699123456789.jpg',
  })
  url: string;
}
