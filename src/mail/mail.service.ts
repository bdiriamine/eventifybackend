import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter | null = null;
  private readonly logger = new Logger(MailService.name);

  constructor(private cfg: ConfigService) {
    const user = cfg.get('MAIL_USER');
    const pass = cfg.get('MAIL_PASS');
    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        host:   cfg.get('MAIL_HOST', 'smtp.gmail.com'),
        port:   cfg.get<number>('MAIL_PORT', 587),
        secure: false,
        auth:   { user, pass },
      });
    } else {
      this.logger.warn('MAIL_USER/MAIL_PASS not set — email sending disabled');
    }
  }

  async sendBookingConfirmation(to: string, booking: any): Promise<void> {
    if (!this.transporter) {
      this.logger.log(`[Mail skipped] booking confirmation to ${to}`);
      return;
    }
    try {
      await this.transporter.sendMail({
        from:    this.cfg.get('MAIL_FROM', 'Eventify Tunisia <noreply@eventify.tn>'),
        to,
        subject: '✦ Confirmation de réservation — Eventify Tunisia',
        html: this.bookingConfirmHtml(booking),
      });
    } catch (err) {
      this.logger.error('sendBookingConfirmation failed', err);
    }
  }

  async sendPaymentReminder(to: string, booking: any, daysLeft: number): Promise<void> {
    if (!this.transporter) return;
    try {
      await this.transporter.sendMail({
        from:    this.cfg.get('MAIL_FROM', 'Eventify Tunisia <noreply@eventify.tn>'),
        to,
        subject: `⏰ Rappel de paiement — ${daysLeft} jour(s) avant votre événement`,
        html: `<p>Bonjour, il vous reste <strong>${daysLeft} jour(s)</strong>. Solde dû : <strong>${booking.remainingAmount} TND</strong>.</p>`,
      });
    } catch (err) {
      this.logger.error('sendPaymentReminder failed', err);
    }
  }

  private bookingConfirmHtml(b: any): string {
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
}
