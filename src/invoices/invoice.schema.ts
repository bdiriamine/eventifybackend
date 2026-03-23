import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type InvoiceDocument = Invoice & Document;
@Schema({ timestamps: true })
export class Invoice {
  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true }) bookingId: Types.ObjectId;
  @Prop({ required: true, unique: true }) invoiceNumber: string;
  @Prop() pdfUrl: string;
  @Prop() totalAmount: number;
  @Prop() paidAmount: number;
  @Prop() remainingAmount: number;
}
export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
