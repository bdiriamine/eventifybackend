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
const CAR_PRICES = {
    berline: { 'half-day': 80, 'full-day': 150, weekend: 280 },
    SUV: { 'half-day': 120, 'full-day': 220, weekend: 400 },
    minivan: { 'half-day': 100, 'full-day': 180, weekend: 340 },
    limousine: { 'half-day': 200, 'full-day': 380, weekend: 700 },
};
const JUICE_PRICE_PER_LITER = 8;
const SALE_PRICES = {
    brik: 15, mlewi: 12, samsa: 20, makroud: 10, kaak: 8,
};
let BookingsService = class BookingsService {
    constructor(model) {
        this.model = model;
    }
    async create(userId, data) {
        var _a, _b, _c, _d, _e, _f;
        if (!data.eventType)
            throw new common_1.BadRequestException('eventType is required');
        if (!data.eventDate)
            throw new common_1.BadRequestException('eventDate is required');
        if (!data.location)
            throw new common_1.BadRequestException('location is required');
        if (!data.guestCount || Number(data.guestCount) < 1)
            throw new common_1.BadRequestException('guestCount >= 1');
        if (!data.nationalId)
            throw new common_1.BadRequestException('nationalId is required');
        let totalPrice = Number(data.hallPrice) || 0;
        const services = [];
        if (Array.isArray(data.services)) {
            for (const s of data.services) {
                const id = s.servicePackId || s._id;
                if (!id)
                    continue;
                services.push({
                    servicePackId: mongoose_2.Types.ObjectId.isValid(id) ? new mongoose_2.Types.ObjectId(id) : undefined,
                    quantity: Number(s.quantity) || 1,
                    subtotal: Number(s.subtotal) || 0,
                });
                totalPrice += Number(s.subtotal) || 0;
            }
        }
        let juiceOrder = null;
        if ((_b = (_a = data.juiceOrder) === null || _a === void 0 ? void 0 : _a.juices) === null || _b === void 0 ? void 0 : _b.length) {
            const juices = data.juiceOrder.juices.map((j) => ({
                type: j.type,
                liters: Number(j.liters) || 1,
            }));
            const totalLiters = juices.reduce((s, j) => s + j.liters, 0);
            const subtotal = totalLiters * JUICE_PRICE_PER_LITER;
            juiceOrder = { juices, totalLiters, subtotal };
            totalPrice += subtotal;
        }
        let carRental = null;
        if ((_c = data.carRental) === null || _c === void 0 ? void 0 : _c.type) {
            const price = ((_e = (_d = CAR_PRICES[data.carRental.type]) === null || _d === void 0 ? void 0 : _d[data.carRental.duration]) !== null && _e !== void 0 ? _e : 0)
                + (data.carRental.withDriver ? 50 : 0);
            carRental = {
                type: data.carRental.type,
                duration: data.carRental.duration || 'full-day',
                withDriver: Boolean(data.carRental.withDriver),
                price,
            };
            totalPrice += price;
        }
        const saleOrders = [];
        if (Array.isArray(data.saleOrders)) {
            for (const s of data.saleOrders) {
                if (!s.type || !s.quantity)
                    continue;
                saleOrders.push({ type: s.type, quantity: Number(s.quantity), unit: s.unit || 'plateau' });
                totalPrice += ((_f = SALE_PRICES[s.type]) !== null && _f !== void 0 ? _f : 15) * Number(s.quantity);
            }
        }
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
            clientNote: data.clientNote || data.notes || '',
            totalPrice,
            depositAmount,
            remainingAmount,
            depositPaid: false,
            remainingPaid: false,
            status: 'Pending',
            services,
            juiceOrder,
            carRental,
            saleOrders,
        };
        if (data.hallId && mongoose_2.Types.ObjectId.isValid(data.hallId)) {
            payload.hallId = new mongoose_2.Types.ObjectId(data.hallId);
        }
        const booking = await this.model.create(payload);
        return this.findById(booking._id.toString());
    }
    async ownerDecision(id, ownerId, approved, note) {
        var _a;
        const b = await this.model.findById(id).populate('hallId');
        if (!b)
            throw new common_1.NotFoundException();
        if (b.status !== 'Pending')
            throw new common_1.BadRequestException('Booking is not pending');
        const hall = b.hallId;
        if (((_a = hall === null || hall === void 0 ? void 0 : hall.managerId) === null || _a === void 0 ? void 0 : _a.toString()) !== ownerId)
            throw new common_1.ForbiddenException('Not your hall');
        b.status = approved ? 'OwnerApproved' : 'OwnerRejected';
        b.ownerNote = note || '';
        await b.save();
        return this.findById(id);
    }
    async adminDecision(id, approved, note) {
        const b = await this.model.findById(id);
        if (!b)
            throw new common_1.NotFoundException();
        if (b.status !== 'OwnerApproved')
            throw new common_1.BadRequestException('Booking must be owner-approved first');
        b.status = approved ? 'AwaitingPayment' : 'AdminRejected';
        b.adminNote = note || '';
        await b.save();
        return this.findById(id);
    }
    async payDeposit(id, userId, paymentMethod) {
        const b = await this.model.findOne({ _id: id, userId });
        if (!b)
            throw new common_1.NotFoundException();
        if (b.status !== 'AwaitingPayment')
            throw new common_1.BadRequestException('Booking is not awaiting payment');
        b.depositPaid = true;
        b.paymentMethod = paymentMethod;
        b.status = 'Confirmed';
        await b.save();
        return this.findById(id);
    }
    async updateStatus(id, status, userRole) {
        const allowed = ['Pending', 'OwnerApproved', 'OwnerRejected', 'AdminValidated', 'AdminRejected', 'AwaitingPayment', 'Confirmed', 'Completed', 'Cancelled'];
        if (!allowed.includes(status))
            throw new common_1.BadRequestException('Invalid status');
        if (!['admin', 'manager'].includes(userRole))
            throw new common_1.ForbiddenException();
        const b = await this.model.findByIdAndUpdate(id, { status }, { new: true });
        if (!b)
            throw new common_1.NotFoundException();
        return this.findById(id);
    }
    async payRemaining(id, userId) {
        const b = await this.model.findOne({ _id: id, userId });
        if (!b)
            throw new common_1.NotFoundException();
        b.remainingPaid = true;
        b.status = 'Completed';
        await b.save();
        return this.findById(id);
    }
    async findAll(query) {
        const filter = {};
        if (query === null || query === void 0 ? void 0 : query.status)
            filter.status = query.status;
        if (query === null || query === void 0 ? void 0 : query.eventType)
            filter.eventType = query.eventType;
        if (query === null || query === void 0 ? void 0 : query.hallId)
            filter.hallId = new mongoose_2.Types.ObjectId(query.hallId);
        return this.model.find(filter)
            .populate('userId', 'name email phone nationalId')
            .populate('hallId', 'name location price managerId')
            .populate('services.servicePackId', 'name category price')
            .sort({ createdAt: -1 });
    }
    async findByUser(userId) {
        return this.model.find({ userId: new mongoose_2.Types.ObjectId(userId) })
            .populate('hallId', 'name location images price')
            .populate('services.servicePackId', 'name category price priceUnit')
            .sort({ createdAt: -1 });
    }
    async findById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id))
            throw new common_1.NotFoundException('Invalid booking ID');
        const b = await this.model.findById(id)
            .populate('userId', 'name email phone nationalId city')
            .populate('hallId', 'name location price images managerId')
            .populate('services.servicePackId', 'name category price priceUnit features');
        if (!b)
            throw new common_1.NotFoundException('Booking not found');
        return b;
    }
    async getAnalytics() {
        var _a;
        const [total, pending, ownerPending, revenue, byType, byMonth] = await Promise.all([
            this.model.countDocuments(),
            this.model.countDocuments({ status: 'Pending' }),
            this.model.countDocuments({ status: 'OwnerApproved' }),
            this.model.aggregate([{ $match: { depositPaid: true } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
            this.model.aggregate([{ $group: { _id: '$eventType', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
            this.model.aggregate([
                { $match: { depositPaid: true } },
                { $group: { _id: { $month: '$createdAt' }, revenue: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } },
            ]),
        ]);
        return { total, pending, ownerPending, revenue: ((_a = revenue[0]) === null || _a === void 0 ? void 0 : _a.total) || 0, byType, byMonth };
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map