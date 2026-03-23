import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  private configured = false;

  constructor(private cfg: ConfigService) {
    const cloudName = cfg.get('CLOUDINARY_CLOUD_NAME');
    const apiKey    = cfg.get('CLOUDINARY_API_KEY');
    const apiSecret = cfg.get('CLOUDINARY_API_SECRET');
    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
      this.configured = true;
    } else {
      this.logger.warn('Cloudinary not configured — image upload disabled');
    }
  }

  async uploadImage(file: Express.Multer.File, folder = 'eventify'): Promise<string> {
    if (!this.configured) {
      this.logger.warn('Upload skipped: Cloudinary not configured');
      return '';
    }
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
        if (err || !result) reject(err ?? new Error('Upload failed'));
        else resolve(result.secure_url);
      });
      stream.end(file.buffer);
    });
  }
}
