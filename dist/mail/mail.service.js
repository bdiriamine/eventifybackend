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
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let MailService = MailService_1 = class MailService {
    constructor(cfg) {
        this.cfg = cfg;
        this.transporter = null;
        this.logger = new common_1.Logger(MailService_1.name);
        const user = cfg.get('MAIL_USER');
        const pass = cfg.get('MAIL_PASS');
        if (user && pass) {
            this.transporter = nodemailer.createTransport({
                host: cfg.get('MAIL_HOST', 'smtp.gmail.com'),
                port: cfg.get('MAIL_PORT', 587),
                secure: false,
                auth: { user, pass },
            });
        }
        else {
            this.logger.warn('MAIL_USER/MAIL_PASS not set — email sending disabled');
        }
    }
    async sendBookingConfirmation(to, booking) {
        if (!this.transporter) {
            this.logger.log(`[Mail skipped] booking confirmation to ${to}`);
            return;
        }
        try {
            await this.transporter.sendMail({
                from: this.cfg.get('MAIL_FROM', 'Eventify Tunisia <noreply@eventify.tn>'),
                to,
                subject: '✦ Confirmation de réservation — Eventify Tunisia',
                html: this.bookingConfirmHtml(booking),
            });
        }
        catch (err) {
            this.logger.error('sendBookingConfirmation failed', err);
        }
    }
    async sendPaymentReminder(to, booking, daysLeft) {
        if (!this.transporter)
            return;
        try {
            await this.transporter.sendMail({
                from: this.cfg.get('MAIL_FROM', 'Eventify Tunisia <noreply@eventify.tn>'),
                to,
                subject: `⏰ Rappel de paiement — ${daysLeft} jour(s) avant votre événement`,
                html: `<p>Bonjour, il vous reste <strong>${daysLeft} jour(s)</strong>. Solde dû : <strong>${booking.remainingAmount} TND</strong>.</p>`,
            });
        }
        catch (err) {
            this.logger.error('sendPaymentReminder failed', err);
        }
    }
    bookingConfirmHtml(b) {
        return `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:40px;text-align:center;border-radius:0 0 20px 20px">
          <h1 style="color:white;margin:0">✦ Eventify Tunisia</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0">Réservation Confirmée</p>
        </div>
        <div style="padding:40px">
          <h2 style="color:#1f2937">Votre événement est réservé !</h2>
          <table style="width:100%;border-collapse:collapse;margin:20px 0">
            <tr style="background:#f9fafb"><td style="padding:12px;font-weight:bold">Type</td><td style="padding:12px">${b.eventType}</td></tr>
            <tr><td style="padding:12px;font-weight:bold">Date</td><td style="padding:12px">${new Date(b.eventDate).toLocaleDateString('fr-TN')}</td></tr>
            <tr style="background:#f9fafb"><td style="padding:12px;font-weight:bold">Total</td><td style="padding:12px;color:#d97706;font-weight:bold">${b.totalPrice} TND</td></tr>
            <tr><td style="padding:12px;font-weight:bold">Acompte payé</td><td style="padding:12px;color:#059669;font-weight:bold">${b.depositAmount} TND</td></tr>
            <tr style="background:#f9fafb"><td style="padding:12px;font-weight:bold">Solde restant</td><td style="padding:12px">${b.remainingAmount} TND</td></tr>
          </table>
        </div>
        <div style="text-align:center;padding:20px;color:#9ca3af;font-size:12px;border-top:1px solid #f3f4f6">
          © 2026 Eventify Tunisia — contact@eventify.tn
        </div>
      </div>`;
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map