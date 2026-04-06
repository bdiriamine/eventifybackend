import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  private cloudinaryConfigured = false;

  /* Public folder served as static files */
  private readonly publicDir = path.join(process.cwd(), 'public', 'uploads');

  constructor(private cfg: ConfigService) {
    const cloudName = cfg.get('CLOUDINARY_CLOUD_NAME');
    const apiKey    = cfg.get('CLOUDINARY_API_KEY');
    const apiSecret = cfg.get('CLOUDINARY_API_SECRET');

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
      this.cloudinaryConfigured = true;
      this.logger.log('Cloudinary configured ✅');
    } else {
      // Ensure local upload folder exists
      fs.mkdirSync(this.publicDir, { recursive: true });
      this.logger.warn('Cloudinary not configured — using local storage at public/uploads/');
    }
  }

  async uploadImage(file: Express.Multer.File, folder = 'eventify'): Promise<string> {
    if (!file) throw new Error('No file provided');

    /* ── Cloudinary ── */
    if (this.cloudinaryConfigured) {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type: 'image' },
          (err, result) => {
            if (err || !result) reject(err ?? new Error('Cloudinary upload failed'));
            else resolve(result.secure_url);
          }
        );
        stream.end(file.buffer);
      });
    }

    /* ── Local storage fallback ── */
    const ext = (file.originalname.split('.').pop() ?? 'jpg').toLowerCase();
    const filename = `${uuidv4()}.${ext}`;
    const subDir = path.join(this.publicDir, folder);
    fs.mkdirSync(subDir, { recursive: true });
    fs.writeFileSync(path.join(subDir, filename), file.buffer);

    const baseUrl = this.cfg.get('BACKEND_URL') || `http://localhost:${this.cfg.get('PORT') || 3001}`;
    return `${baseUrl}/uploads/${folder}/${filename}`;
  }
}
