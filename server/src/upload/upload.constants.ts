export const UPLOAD_CONSTANTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10 MB
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  UPLOAD_DESTINATION: './uploads',
  MAX_FILES_COUNT: 10,
};

export const UPLOAD_ERRORS = {
  FILE_TOO_LARGE: 'File size exceeds the maximum limit of 10 MB',
  INVALID_FILE_TYPE: 'Only image files are allowed (JPEG, PNG, WebP, GIF)',
  FILE_NOT_FOUND: 'File not found',
  FILE_DELETE_FAILED: 'Failed to delete file',
  NO_FILE_PROVIDED: 'No file provided',
  INVALID_FILENAME: 'Invalid filename',
};
