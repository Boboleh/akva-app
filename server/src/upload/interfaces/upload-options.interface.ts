export interface UploadedFileInfo {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
}

export interface UploadOptions {
  maxFileSize?: number;
  allowedMimeTypes?: string[];
  destination?: string;
}
