import { BadRequestException, Injectable } from '@nestjs/common';

import { ALLOWED_FILE_TYPES } from './upload.constants';
import FileHandler from './file-handler';

@Injectable()
export class UploadService {
  public async validateFileType(file: Express.Multer.File): Promise<boolean> {
    try {
      // Check what MIME type the file is supposed to have
      // This is the same mimetype that was provided with the request
      // (Multer doesn't actually check what the file is)
      const expectedMimeType = file.mimetype;
      if (!expectedMimeType) throw new BadRequestException('No MIME type set');

      // Check if the file type is on of the allowe file types
      // This is essentially the same check as in the upload.module.ts
      // But since we need to know what the allowed magic numbers are
      // We still have to look it up.
      const fileType = ALLOWED_FILE_TYPES.find((t) => t.mimeTypes.includes(expectedMimeType));
      if (!fileType) throw new BadRequestException('Invalid file type');

      // Here we check whether the file extension is allowed
      // For the MIME type the file is supposed to have
      const fileExtension = FileHandler.parseFileExtension(file.originalname);
      if (!fileType.fileExtensions.includes(fileExtension))
        throw new BadRequestException('Invalid File Extension');

      // Finally, we actually check whether the request was lying to us
      // or whether the file is actually what it's supposed to be
      const isValidMagicNumber = await FileHandler.validateMagicNumber(
        file.path,
        fileType.magicNumbers,
      );
      if (!isValidMagicNumber) throw new BadRequestException('Invalid Magic number');
    } catch (err) {
      // If anything happens during validation make sure to remove
      // the file as part of the rollback process
      FileHandler.deleteFile(file.path);

      console.log('throwing');
      throw err;
    }

    return true;
  }
}
