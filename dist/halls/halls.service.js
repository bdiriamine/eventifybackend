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
exports.HallsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const hall_schema_1 = require("./hall.schema");
let HallsService = class HallsService {
    constructor(hallModel) {
        this.hallModel = hallModel;
    }
    async create(data) {
        const payload = {
            name: data.name,
            location: data.location,
            capacity: Number(data.capacity),
            price: Number(data.price),
            description: data.description || '',
            images: Array.isArray(data.images) ? data.images : (data.images ? [data.images] : []),
            tags: Array.isArray(data.tags) ? data.tags : [],
            availabilityCalendar: [],
            rating: Number(data.rating) || 0,
            reviewCount: Number(data.reviewCount) || 0,
            isActive: true,
        };
        if (data.managerId && mongoose_2.Types.ObjectId.isValid(data.managerId)) {
            payload.managerId = new mongoose_2.Types.ObjectId(data.managerId);
        }
        return this.hallModel.create(payload);
    }
    async findAll(adminMode = false) {
        const filter = adminMode ? {} : { isActive: true };
        return this.hallModel.find(filter).populate('managerId', 'name email').sort({ createdAt: -1 });
    }
    async findById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.NotFoundException('Invalid hall ID');
        const h = await this.hallModel.findById(id).populate('managerId', 'name email');
        if (!h)
            throw new common_1.NotFoundException('Hall not found');
        return h;
    }
    async findByManager(managerId) {
        return this.hallModel.find({ managerId: new mongoose_2.Types.ObjectId(managerId), isActive: true });
    }
    async update(id, data) {
        const update = {};
        if (data.name !== undefined)
            update.name = data.name;
        if (data.location !== undefined)
            update.location = data.location;
        if (data.capacity !== undefined)
            update.capacity = Number(data.capacity);
        if (data.price !== undefined)
            update.price = Number(data.price);
        if (data.description !== undefined)
            update.description = data.description;
        if (data.tags !== undefined)
            update.tags = data.tags;
        if (data.isActive !== undefined)
            update.isActive = data.isActive;
        if (data.rating !== undefined)
            update.rating = Number(data.rating);
        if (data.images !== undefined)
            update.images = Array.isArray(data.images) ? data.images : [data.images];
        if (data.managerId !== undefined && mongoose_2.Types.ObjectId.isValid(data.managerId)) {
            update.managerId = new mongoose_2.Types.ObjectId(data.managerId);
        }
        const h = await this.hallModel.findByIdAndUpdate(id, update, { new: true });
        if (!h)
            throw new common_1.NotFoundException('Hall not found');
        return h;
    }
    async delete(id) {
        const h = await this.hallModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!h)
            throw new common_1.NotFoundException('Hall not found');
    }
    async updateAvailability(id, dates) {
        const h = await this.hallModel.findByIdAndUpdate(id, { availabilityCalendar: dates }, { new: true });
        if (!h)
            throw new common_1.NotFoundException('Hall not found');
        return h;
    }
};
exports.HallsService = HallsService;
exports.HallsService = HallsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(hall_schema_1.Hall.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], HallsService);
//# sourceMappingURL=halls.service.js.map