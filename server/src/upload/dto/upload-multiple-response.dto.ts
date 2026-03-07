import { ApiProperty } from '@nestjs/swagger';
import { UploadResponseDto } from './upload-response.dto';

export class UploadMultipleResponseDto {
  @ApiProperty({
    description: 'Array of uploaded files',
    type: [UploadResponseDto],
  })
  files: UploadResponseDto[];

  @ApiProperty({
    description: 'Total count of uploaded files',
    example: 3,
  })
  count: number;
}
