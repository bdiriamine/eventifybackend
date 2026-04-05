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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingSchema = exports.Booking = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const JuiceOrderSchema = {
    type: { type: String },
    liters: { type: Number, default: 1 },
};
const CarRentalSchema = {
    type: { type: String },
    duration: { type: String },
    withDriver: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
};
const SaleSchema = {
    type: { type: String },
    quantity: { type: Number, default: 1 },
    unit: { type: String, default: 'plateau' },
};
let Booking = class Booking {
};
exports.Booking = Booking;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Booking.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['wedding', 'henna', 'concert', 'conference'], required: true }),
    __metadata("design:type", String)
], Booking.prototype, "eventType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Booking.prototype, "eventDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Booking.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], Booking.prototype, "guestCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Hall' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Booking.prototype, "hallId", void 0);
__decorate([
    (0, mongoose_1.Prop)([{ servicePackId: { type: mongoose_2.Types.ObjectId, ref: 'Service' }, quantity: { type: Number, default: 1 }, subtotal: Number }]),
    __metadata("design:type", Array)
], Booking.prototype, "services", void 0);
__decorate([
    (0, mongoose_1.Prop)([{ productId: { type: mongoose_2.Types.ObjectId, ref: 'Product' }, quantity: Number, subtotal: Number }]),
    __metadata("design:type", Array)
], Booking.prototype, "products", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: { juices: [JuiceOrderSchema], totalLiters: Number, subtotal: Number } }),
    __metadata("design:type", Object)
], Booking.prototype, "juiceOrder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: CarRentalSchema }),
    __metadata("design:type", Object)
], Booking.prototype, "carRental", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [SaleSchema], default: [] }),
    __metadata("design:type", Array)
], Booking.prototype, "saleOrders", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Booking.prototype, "totalPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Booking.prototype, "depositAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Booking.prototype, "depositPaid", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Booking.prototype, "remainingAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Booking.prototype, "remainingPaid", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['Pending', 'OwnerApproved', 'OwnerRejected', 'AdminValidated', 'AdminRejected', 'AwaitingPayment', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Pending',
    }),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "ownerNote", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "adminNote", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "clientNote", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Booking.prototype, "nationalId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Booking.prototype, "acceptedTerms", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "notes", void 0);
exports.Booking = Booking = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Booking);
exports.BookingSchema = mongoose_1.SchemaFactory.createForClass(Booking);
//# sourceMappingURL=booking.schema.js.map