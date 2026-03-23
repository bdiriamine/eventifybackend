import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from './invoice.schema';
import * as PDFDocument from 'pdfkit';
import * as path from 'path';

@Injectable()
export class InvoicesService {
  constructor(@InjectModel(Invoice.name) private model: Model<InvoiceDocument>) {}

  async findByBooking(bookingId: string) {
    return this.model.findOne({ bookingId }).populate('bookingId');
  }

  async findByUser(userId: string) {
    return this.model.find().populate({
      path: 'bookingId',
      match: { userId },
    });
  }

  async generatePdf(bookingId: string, bookingData: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(24).fillColor('#f59e0b').text('✦ EVENTIFY TUNISIA', 50, 50);
      doc.fontSize(10).fillColor('#6b7280').text('Plateforme de Planification d\'Événements', 50, 80);
      doc.moveDown(2);

      // Invoice title
      doc.fontSize(18).fillColor('#1f2937').text(`FACTURE`, 50, 120);
      doc.fontSize(12).fillColor('#6b7280').text(`N° ${bookingData.invoiceNumber || 'INV-' + Date.now()}`, 50, 145);
      doc.text(`Date: ${new Date().toLocaleDateString('fr-TN')}`, 50, 162);

      doc.moveTo(50, 185).lineTo(550, 185).stroke('#e5e7eb');

      // Client info
      doc.fontSize(13).fillColor('#1f2937').text('INFORMATIONS CLIENT', 50, 200);
      doc.fontSize(11).fillColor('#374151');
      doc.text(`Nom: ${bookingData.clientName || 'N/A'}`, 50, 220);
      doc.text(`CIN: ${bookingData.nationalId || 'N/A'}`, 50, 238);
      doc.text(`Email: ${bookingData.email || 'N/A'}`, 50, 256);

      // Event details
      doc.fontSize(13).fillColor('#1f2937').text('DÉTAILS DE L\'ÉVÉNEMENT', 50, 290);
      doc.fontSize(11).fillColor('#374151');
      doc.text(`Type: ${bookingData.eventType || 'N/A'}`, 50, 310);
      doc.text(`Date: ${bookingData.eventDate ? new Date(bookingData.eventDate).toLocaleDateString('fr-TN') : 'N/A'}`, 50, 328);
      doc.text(`Lieu: ${bookingData.location || 'N/A'}`, 50, 346);
      doc.text(`Invités: ${bookingData.guestCount || 'N/A'}`, 50, 364);

      doc.moveTo(50, 385).lineTo(550, 385).stroke('#e5e7eb');

      // Pricing
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

      // Terms
      doc.moveDown(3);
      doc.fontSize(9).fillColor('#9ca3af');
      doc.text('Ce document constitue une facture officielle. Le client s\'engage à respecter les conditions générales acceptées lors de la réservation.', 50, y + 90, { width: 500 });

      // Footer
      doc.fontSize(10).fillColor('#6b7280').text('Eventify Tunisia — contact@eventify.tn — +216 71 000 000 — Tunis, Tunisie', 50, 720, { align: 'center' });

      doc.end();
    });
  }
}
