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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./product.schema");
let ProductsService = class ProductsService {
    constructor(model) {
        this.model = model;
    }
    async findAll(adminMode = false) {
        const filter = adminMode ? {} : { isActive: true };
        return this.model.find(filter).sort({ category: 1, name: 1 });
    }
    async findById(id) {
        const p = await this.model.findById(id);
        if (!p)
            throw new common_1.NotFoundException('Product not found');
        return p;
    }
    async create(data) {
        if (!data.name)
            throw new common_1.BadRequestException('name is required');
        if (data.price === undefined)
            throw new common_1.BadRequestException('price is required');
        return this.model.create({
            name: data.name,
            description: data.description || '',
            price: Number(data.price),
            priceUnit: data.priceUnit || '/unité',
            icon: data.icon || '📦',
            category: data.category || 'Autre',
            stock: Number(data.stock) || 0,
            images: Array.isArray(data.images) ? data.images : [],
            rentalAvailable: data.rentalAvailable !== false,
            isActive: true,
        });
    }
    async update(id, data) {
        const update = {};
        if (data.name !== undefined)
            update.name = data.name;
        if (data.description !== undefined)
            update.description = data.description;
        if (data.price !== undefined)
            update.price = Number(data.price);
        if (data.priceUnit !== undefined)
            update.priceUnit = data.priceUnit;
        if (data.icon !== undefined)
            update.icon = data.icon;
        if (data.category !== undefined)
            update.category = data.category;
        if (data.stock !== undefined)
            update.stock = Number(data.stock);
        if (data.rentalAvailable !== undefined)
            update.rentalAvailable = Boolean(data.rentalAvailable);
        if (data.isActive !== undefined)
            update.isActive = Boolean(data.isActive);
        const p = await this.model.findByIdAndUpdate(id, update, { new: true });
        if (!p)
            throw new common_1.NotFoundException('Product not found');
        return p;
    }
    async delete(id) {
        const p = await this.model.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!p)
            throw new common_1.NotFoundException('Product not found');
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=products.service.js.map