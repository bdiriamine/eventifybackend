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
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const invoice_schema_1 = require("./invoice.schema");
const PDFDocument = require("pdfkit");
let InvoicesService = class InvoicesService {
    constructor(model) {
        this.model = model;
    }
    async findByBooking(bookingId) {
        return this.model.findOne({ bookingId }).populate('bookingId');
    }
    async findByUser(userId) {
        return this.model.find().populate({
            path: 'bookingId',
            match: { userId },
        });
    }
    async generatePdf(bookingId, bookingData) {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50 });
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            doc.fontSize(24).fillColor('#f59e0b').text('✦ EVENTIFY TUNISIA', 50, 50);
            doc.fontSize(10).fillColor('#6b7280').text('Plateforme de Planification d\'Événements', 50, 80);
            doc.moveDown(2);
            doc.fontSize(18).fillColor('#1f2937').text(`FACTURE`, 50, 120);
            doc.fontSize(12).fillColor('#6b7280').text(`N° ${bookingData.invoiceNumber || 'INV-' + Date.now()}`, 50, 145);
            doc.text(`Date: ${new Date().toLocaleDateString('fr-TN')}`, 50, 162);
            doc.moveTo(50, 185).lineTo(550, 185).stroke('#e5e7eb');
            doc.fontSize(13).fillColor('#1f2937').text('INFORMATIONS CLIENT', 50, 200);
            doc.fontSize(11).fillColor('#374151');
            doc.text(`Nom: ${bookingData.clientName || 'N/A'}`, 50, 220);
            doc.text(`CIN: ${bookingData.nationalId || 'N/A'}`, 50, 238);
            doc.text(`Email: ${bookingData.email || 'N/A'}`, 50, 256);
            doc.fontSize(13).fillColor('#1f2937').text('DÉTAILS DE L\'ÉVÉNEMENT', 50, 290);
            doc.fontSize(11).fillColor('#374151');
            doc.text(`Type: ${bookingData.eventType || 'N/A'}`, 50, 310);
            doc.text(`Date: ${bookingData.eventDate ? new Date(bookingData.eventDate).toLocaleDateString('fr-TN') : 'N/A'}`, 50, 328);
            doc.text(`Lieu: ${bookingData.location || 'N/A'}`, 50, 346);
            doc.text(`Invités: ${bookingData.guestCount || 'N/A'}`, 50, 364);
            doc.moveTo(50, 385).lineTo(550, 385).stroke('#e5e7eb');
            doc.fontSize(13).fillColor('#1f2937').text('RÉCAPITULATIF FINANCIER', 50, 400);
            const y = 425;
            doc.fontSize(11).fillColor('#374151');
            doc.text('Total de la prestation:', 50, y);
            doc.fillColor('#f59e0b').text(`${bookingData.totalPrice || 0} TND`, 400, y);
            doc.fillColor('#374151').text('Acompte payé (70%):', 50, y + 20);
            doc.fillColor('#059669').text(`${bookingData.depositAmount || 0} TND`, 400, y + 20);
            doc.fillColor('#374151').text('Solde restant:', 50, y + 40);
            doc.fillColor('#dc2626').text(`${bookingData.remainingAmount || 0} TND`, 400, y + 40);
            doc.moveTo(50, y + 65).lineTo(550, y + 65).lineWidth(2).stroke('#f59e0b');
            doc.moveDown(3);
            doc.fontSize(9).fillColor('#9ca3af');
            doc.text('Ce document constitue une facture officielle. Le client s\'engage à respecter les conditions générales acceptées lors de la réservation.', 50, y + 90, { width: 500 });
            doc.fontSize(10).fillColor('#6b7280').text('Eventify Tunisia — contact@eventify.tn — +216 71 000 000 — Tunis, Tunisie', 50, 720, { align: 'center' });
            doc.end();
        });
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(invoice_schema_1.Invoice.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map