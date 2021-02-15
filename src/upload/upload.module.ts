import * as multer from 'multer';

import {
  ALLOWED_FILE_TYPES,
  FILE_MASK_LENGTH,
  FILE_MAX_SIZE,
  FILE_NAME_PREFIX,
} from './upload.constants';

import FileHandler from './file-handler';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    MulterModule.register({
      // This check happens before the file is actually uploaded
      // to avoid unnecessary processing later on
      fileFilter: async (req, file, cb) => {
        const invalidateUpload = async (errorMessage: string) => {
          req.fileValidationError = errorMessage;
          return cb(null, false);
        };

        // Check for the MIME type which was supplied with the request
        // and whether it's  one of the allowed MIME types
        // (This can be manipulated easily)
        const expectedMimeType = file.mimetype;
        if (!expectedMimeType) return invalidateUpload('No MIME type set');

        const fileType = ALLOWED_FILE_TYPES.find((t) => t.mimeTypes.includes(expectedMimeType));
        if (!fileType) return invalidateUpload('Invalid MIME type');

        // If everything is ok, continue
        cb(null, true);
      },

      limits: {
        // Here we set the max file size to avoid
        // receiving huge files
        fileSize: FILE_MAX_SIZE,
      },

      storage: multer.diskStorage({
        // Must be an empty string in order to use
        // absolute file paths in the filename option
        // (we use the /tmp directory)
        destination: '',

        // This is just to tell multer
        // that we want to create a /tmp file
        // And not store it anywhere else
        filename: (_, file: Express.Multer.File, cb) => {
          const fileExtension = FileHandler.parseFileExtension(file.originalname);

          FileHandler.createTempFile(
            // We use a custom prefix to detect which files where uploaded
            // by this application and mask it with some random characters
            // (same as mktemp -t XXX... on Unix systems)
            `${FILE_NAME_PREFIX}${'X'.repeat(FILE_MASK_LENGTH)}${fileExtension}`,
          )
            .then(async (filePath) => {
              cb(null, filePath);
            })
            .catch((err) => {
              console.error(err);
              cb(err, null);
            });
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [],
})
export class UploadModule {}
