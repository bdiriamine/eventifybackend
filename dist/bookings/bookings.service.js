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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const booking_schema_1 = require("./booking.schema");
const DEPOSIT_RATIO = 0.70;
let BookingsService = class BookingsService {
    constructor(model) {
        this.model = model;
    }
    async create(userId, data) {
        if (!data.eventType)
            throw new common_1.BadRequestException('eventType is required');
        if (!data.eventDate)
            throw new common_1.BadRequestException('eventDate is required');
        if (!data.location)
            throw new common_1.BadRequestException('location is required');
        if (!data.guestCount || data.guestCount < 1)
            throw new common_1.BadRequestException('guestCount must be >= 1');
        if (!data.nationalId)
            throw new common_1.BadRequestException('nationalId is required');
        const totalPrice = Number(data.totalPrice) || 0;
        const depositAmount = Math.round(totalPrice * DEPOSIT_RATIO);
        const remainingAmount = totalPrice - depositAmount;
        const payload = {
            userId: new mongoose_2.Types.ObjectId(userId),
            eventType: data.eventType,
            eventDate: new Date(data.eventDate),
            location: data.location,
            guestCount: Number(data.guestCount),
            nationalId: data.nationalId,
            acceptedTerms: Boolean(data.acceptedTerms),
            paymentMethod: data.paymentMethod || '',
            totalPrice,
            depositAmount,
            remainingAmount,
            depositPaid: true,
            remainingPaid: false,
            status: 'Confirmed',
            notes: data.notes || '',
        };
        if (data.hallId && mongoose_2.Types.ObjectId.isValid(data.hallId)) {
            payload.hallId = new mongoose_2.Types.ObjectId(data.hallId);
        }
        if (Array.isArray(data.services) && data.services.length > 0) {
            payload.services = data.services
                .filter((s) => s.servicePackId || s._id)
                .map((s) => {
                const id = s.servicePackId || s._id;
                return {
                    servicePackId: mongoose_2.Types.ObjectId.isValid(id) ? new mongoose_2.Types.ObjectId(id) : undefined,
                    quantity: Number(s.quantity) || 1,
                    subtotal: Number(s.subtotal) || 0,
                };
            });
        }
        if (Array.isArray(data.products) && data.products.length > 0) {
            payload.products = data.products
                .filter((p) => p.productId)
                .map((p) => ({
                productId: mongoose_2.Types.ObjectId.isValid(p.productId) ? new mongoose_2.Types.ObjectId(p.productId) : undefined,
                quantity: Number(p.quantity) || 1,
                subtotal: Number(p.subtotal) || 0,
            }));
        }
        const booking = await this.model.create(payload);
        return booking.populate([
            { path: 'hallId', select: 'name location price' },
        ]);
    }
    async findAll(query) {
        const filter = {};
        if (query === null || query === void 0 ? void 0 : query.status)
            filter.status = query.status;
        if (query === null || query === void 0 ? void 0 : query.eventType)
            filter.eventType = query.eventType;
        if (query === null || query === void 0 ? void 0 : query.hallId)
            filter.hallId = query.hallId;
        return this.model
            .find(filter)
            .populate('userId', 'name email phone nationalId')
            .populate('hallId', 'name location price')
            .populate('services.servicePackId', 'name category price')
            .sort({ createdAt: -1 });
    }
    async findByUser(userId) {
        return this.model
            .find({ userId: new mongoose_2.Types.ObjectId(userId) })
            .populate('hallId', 'name location images price')
            .populate('services.servicePackId', 'name category price priceUnit')
            .sort({ createdAt: -1 });
    }
    async findById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.NotFoundException('Invalid booking ID');
        const b = await this.model
            .findById(id)
            .populate('userId', 'name email phone nationalId city')
            .populate('hallId', 'name location price images')
            .populate('services.servicePackId', 'name category price priceUnit features');
        if (!b)
            throw new common_1.NotFoundException('Booking not found');
        return b;
    }
    async updateStatus(id, status, userRole) {
        const allowed = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
        if (!allowed.includes(status))
            throw new common_1.BadRequestException('Invalid status');
        if (!['admin', 'manager'].includes(userRole))
            throw new common_1.ForbiddenException();
        const b = await this.model
            .findByIdAndUpdate(id, { status }, { new: true })
            .populate('userId', 'name email')
            .populate('hallId', 'name location');
        if (!b)
            throw new common_1.NotFoundException();
        return b;
    }
    async payDeposit(id, userId, paymentMethod) {
        const b = await this.model.findOne({ _id: id, userId });
        if (!b)
            throw new common_1.NotFoundException();
        b.depositPaid = true;
        b.paymentMethod = paymentMethod;
        b.status = 'Confirmed';
        await b.save();
        return b;
    }
    async payRemaining(id, userId, paymentMethod) {
        const b = await this.model.findOne({ _id: id, userId });
        if (!b)
            throw new common_1.NotFoundException();
        b.remainingPaid = true;
        b.status = 'Completed';
        await b.save();
        return b;
    }
    async getAnalytics() {
        var _a;
        const [total, pending, revenue, byType, byMonth] = await Promise.all([
            this.model.countDocuments(),
            this.model.countDocuments({ status: 'Pending' }),
            this.model.aggregate([
                { $match: { depositPaid: true } },
                { $group: { _id: null, total: { $sum: '$totalPrice' } } },
            ]),
            this.model.aggregate([
                { $group: { _id: '$eventType', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            this.model.aggregate([
                { $match: { depositPaid: true } },
                {
                    $group: {
                        _id: { $month: '$createdAt' },
                        revenue: { $sum: '$totalPrice' },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
        ]);
        return {
            total,
            pending,
            revenue: ((_a = revenue[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
            byType,
            byMonth,
        };
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map