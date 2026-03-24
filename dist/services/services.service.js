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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const service_schema_1 = require("./service.schema");
const VALID_CATEGORIES = ['photography', 'decoration', 'catering', 'drinks', 'servers', 'entertainment'];
let ServicesService = class ServicesService {
    constructor(model) {
        this.model = model;
    }
    async findAll(adminMode = false) {
        const filter = adminMode ? {} : { isActive: true };
        return this.model.find(filter).sort({ category: 1, price: 1 });
    }
    async findById(id) {
        const s = await this.model.findById(id);
        if (!s)
            throw new common_1.NotFoundException('Service not found');
        return s;
    }
    async create(data) {
        if (!data.name)
            throw new common_1.BadRequestException('name is required');
        if (!data.category)
            throw new common_1.BadRequestException('category is required');
        if (!VALID_CATEGORIES.includes(data.category)) {
            throw new common_1.BadRequestException(`category must be one of: ${VALID_CATEGORIES.join(', ')}`);
        }
        if (data.price === undefined)
            throw new common_1.BadRequestException('price is required');
        return this.model.create({
            name: data.name,
            description: data.description || '',
            price: Number(data.price),
            priceUnit: data.priceUnit || '',
            category: data.category,
            features: Array.isArray(data.features) ? data.features : [],
            images: Array.isArray(data.images) ? data.images : [],
            eventTypes: Array.isArray(data.eventTypes) ? data.eventTypes : [],
            isActive: true,
        });
    }
    async update(id, data) {
        if (data.category && !VALID_CATEGORIES.includes(data.category)) {
            throw new common_1.BadRequestException(`category must be one of: ${VALID_CATEGORIES.join(', ')}`);
        }
        const update = {};
        if (data.name !== undefined)
            update.name = data.name;
        if (data.description !== undefined)
            update.description = data.description;
        if (data.price !== undefined)
            update.price = Number(data.price);
        if (data.priceUnit !== undefined)
            update.priceUnit = data.priceUnit;
        if (data.category !== undefined)
            update.category = data.category;
        if (data.features !== undefined)
            update.features = data.features;
        if (data.eventTypes !== undefined)
            update.eventTypes = data.eventTypes;
        if (data.isActive !== undefined)
            update.isActive = Boolean(data.isActive);
        const s = await this.model.findByIdAndUpdate(id, update, { new: true });
        if (!s)
            throw new common_1.NotFoundException('Service not found');
        return s;
    }
    async delete(id) {
        const s = await this.model.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!s)
            throw new common_1.NotFoundException('Service not found');
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(service_schema_1.Service.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], ServicesService);
//# sourceMappingURL=services.service.js.map