import { ConfigService } from '@nestjs/config';
export declare class UploadsService {
    private cfg;
    private readonly logger;
    private cloudinaryConfigured;
    private readonly publicDir;
    constructor(cfg: ConfigService);
    uploadImage(file: Express.Multer.File, folder?: string): Promise<string>;
}
