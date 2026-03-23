import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type BookingDocument = Booking & Document;

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) userId: Types.ObjectId;
  @Prop({ enum: ['wedding','henna','concert','conference'], required: true }) eventType: string;
  @Prop({ required: true }) eventDate: Date;
  @Prop({ required: true }) location: string;
  @Prop({ required: true, min: 1 }) guestCount: number;
  @Prop({ type: Types.ObjectId, ref: 'Hall' }) hallId: Types.ObjectId;
  @Prop([{
    servicePackId: { type: Types.ObjectId, ref: 'Service' },
    quantity: { type: Number, default: 1 },
    subtotal: Number
  }]) services: any[];
  @Prop([{
    productId: { type: Types.ObjectId, ref: 'Product' },
    quantity: Number,
    subtotal: Number
  }]) products: any[];
  @Prop({ required: true, min: 0 }) totalPrice: number;
  @Prop({ required: true, min: 0 }) depositAmount: number;
  @Prop({ default: false }) depositPaid: boolean;
  @Prop({ required: true, min: 0 }) remainingAmount: number;
  @Prop({ default: false }) remainingPaid: boolean;
  @Prop({ enum: ['Pending','Confirmed','Completed','Cancelled'], default: 'Pending' }) status: string;
  @Prop({ required: true }) nationalId: string;
  @Prop({ default: false }) acceptedTerms: boolean;
  @Prop() paymentMethod: string;
  @Prop() notes: string;
}
export const BookingSchema = SchemaFactory.createForClass(Booking);
