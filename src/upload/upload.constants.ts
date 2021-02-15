// Prefix for the uploaded file name
export const FILE_NAME_PREFIX = 'upload-';

// The length of the generated file name
// after the prefix
export const FILE_MASK_LENGTH = 10;

// Max file size: 1'000'000 Bytes
export const FILE_MAX_SIZE = 1e6;

// The list of allowed file types
// as well as their spec
export const ALLOWED_FILE_TYPES = [
  {
    mimeTypes: ['image/jpeg'],
    magicNumbers: ['image/jpeg'],
    fileExtensions: ['.jpg', 'jpeg'],
  },
  {
    mimeTypes: ['image/png'],
    magicNumbers: ['image/png'],
    fileExtensions: ['.png'],
  },
];
