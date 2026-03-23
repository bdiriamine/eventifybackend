import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private svc;
    constructor(svc: UploadsService);
    uploadImage(file: Express.Multer.File): Promise<{
        url: string;
    }>;
}
