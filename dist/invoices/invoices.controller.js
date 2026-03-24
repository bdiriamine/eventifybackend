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
exports.InvoicesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const invoices_service_1 = require("./invoices.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const bookings_service_1 = require("../bookings/bookings.service");
let InvoicesController = class InvoicesController {
    constructor(invoicesService, bookingsService) {
        this.invoicesService = invoicesService;
        this.bookingsService = bookingsService;
    }
    findMy(req) { return this.invoicesService.findByUser(req.user.sub); }
    findByBooking(id) { return this.invoicesService.findByBooking(id); }
    async download(bookingId, res, req) {
        const booking = await this.bookingsService.findById(bookingId);
        const user = booking.userId;
        const pdfBuffer = await this.invoicesService.generatePdf(bookingId, {
            invoiceNumber: `INV-${bookingId.slice(-6).toUpperCase()}`,
            clientName: user === null || user === void 0 ? void 0 : user.name,
            nationalId: booking.nationalId,
            email: user === null || user === void 0 ? void 0 : user.email,
            eventType: booking.eventType,
            eventDate: booking.eventDate,
            location: booking.location,
            guestCount: booking.guestCount,
            totalPrice: booking.totalPrice,
            depositAmount: booking.depositAmount,
            remainingAmount: booking.remainingAmount,
        });
        res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename=facture-eventify-${bookingId.slice(-6)}.pdf`, 'Content-Length': pdfBuffer.length });
        res.end(pdfBuffer);
    }
};
exports.InvoicesController = InvoicesController;
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], InvoicesController.prototype, "findMy", null);
__decorate([
    (0, common_1.Get)('booking/:bookingId'),
    __param(0, (0, common_1.Param)('bookingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvoicesController.prototype, "findByBooking", null);
__decorate([
    (0, common_1.Get)(':bookingId/download'),
    __param(0, (0, common_1.Param)('bookingId')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], InvoicesController.prototype, "download", null);
exports.InvoicesController = InvoicesController = __decorate([
    (0, swagger_1.ApiTags)('Invoices'),
    (0, common_1.Controller)('invoices'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [invoices_service_1.InvoicesService, bookings_service_1.BookingsService])
], InvoicesController);
//# sourceMappingURL=invoices.controller.js.map