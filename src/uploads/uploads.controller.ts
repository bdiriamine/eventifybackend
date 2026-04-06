import {
  Controller, Post, UseInterceptors, UploadedFile,
  UseGuards, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Uploads')
@Controller('uploads')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadsController {
  constructor(private svc: UploadsService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Image file', schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException('Only image files are allowed (jpg, png, webp, gif)');
    }
    const url = await this.svc.uploadImage(file, 'eventify');
    return { url, filename: file.originalname, size: file.size };
  }
}
