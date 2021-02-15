import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('/upload')
export class UploadController {
  @Inject(UploadService)
  private readonly uploadService: UploadService;

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<Express.Multer.File> {
    const uploadSuccessful = await this.uploadService.validateFileType(file);
    if (uploadSuccessful) return file;
  }
}
