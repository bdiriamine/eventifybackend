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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
let UploadsService = UploadsService_1 = class UploadsService {
    constructor(cfg) {
        this.cfg = cfg;
        this.logger = new common_1.Logger(UploadsService_1.name);
        this.configured = false;
        const cloudName = cfg.get('CLOUDINARY_CLOUD_NAME');
        const apiKey = cfg.get('CLOUDINARY_API_KEY');
        const apiSecret = cfg.get('CLOUDINARY_API_SECRET');
        if (cloudName && apiKey && apiSecret) {
            cloudinary_1.v2.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
            this.configured = true;
        }
        else {
            this.logger.warn('Cloudinary not configured — image upload disabled');
        }
    }
    async uploadImage(file, folder = 'eventify') {
        if (!this.configured) {
            this.logger.warn('Upload skipped: Cloudinary not configured');
            return '';
        }
        return new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream({ folder }, (err, result) => {
                if (err || !result)
                    reject(err !== null && err !== void 0 ? err : new Error('Upload failed'));
                else
                    resolve(result.secure_url);
            });
            stream.end(file.buffer);
        });
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = UploadsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map