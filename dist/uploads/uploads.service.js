"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UploadsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
const fs = require("fs");
const path = require("path");
const uuid_1 = require("uuid");
let UploadsService = UploadsService_1 = class UploadsService {
    constructor(cfg) {
        this.cfg = cfg;
        this.logger = new common_1.Logger(UploadsService_1.name);
        this.cloudinaryConfigured = false;
        this.publicDir = path.join(process.cwd(), 'public', 'uploads');
        const cloudName = cfg.get('CLOUDINARY_CLOUD_NAME');
        const apiKey = cfg.get('CLOUDINARY_API_KEY');
        const apiSecret = cfg.get('CLOUDINARY_API_SECRET');
        if (cloudName && apiKey && apiSecret) {
            cloudinary_1.v2.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
            this.cloudinaryConfigured = true;
            this.logger.log('Cloudinary configured ✅');
        }
        else {
            fs.mkdirSync(this.publicDir, { recursive: true });
            this.logger.warn('Cloudinary not configured — using local storage at public/uploads/');
        }
    }
    async uploadImage(file, folder = 'eventify') {
        var _a;
        if (!file)
            throw new Error('No file provided');
        if (this.cloudinaryConfigured) {
            return new Promise((resolve, reject) => {
                const stream = cloudinary_1.v2.uploader.upload_stream({ folder, resource_type: 'image' }, (err, result) => {
                    if (err || !result)
                        reject(err !== null && err !== void 0 ? err : new Error('Cloudinary upload failed'));
                    else
                        resolve(result.secure_url);
                });
                stream.end(file.buffer);
            });
        }
        const ext = ((_a = file.originalname.split('.').pop()) !== null && _a !== void 0 ? _a : 'jpg').toLowerCase();
        const filename = `${(0, uuid_1.v4)()}.${ext}`;
        const subDir = path.join(this.publicDir, folder);
        fs.mkdirSync(subDir, { recursive: true });
        fs.writeFileSync(path.join(subDir, filename), file.buffer);
        const baseUrl = this.cfg.get('BACKEND_URL') || `http://localhost:${this.cfg.get('PORT') || 3001}`;
        return `${baseUrl}/uploads/${folder}/${filename}`;
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = UploadsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map