import { ConfigService } from '@nestjs/config';
export declare class UploadsService {
    private cfg;
    private readonly logger;
    private configured;
    constructor(cfg: ConfigService);
    uploadImage(file: Express.Multer.File, folder?: string): Promise<string>;
}
