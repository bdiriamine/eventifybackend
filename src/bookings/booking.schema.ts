import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

// Définir des classes pour les sous-documents
class JuiceOrder {
  @Prop({ type: String })  // 'orange','pomme','mangue','grenadine','citron'
  type: string;

  @Prop({ default: 1 })
  liters: number;
}

class CarRental {
  @Prop({ type: String })  // 'berline','SUV','minivan','limousine'
  type: string;

  @Prop({ type: String })  // 'half-day','full-day','weekend'
  duration: string;

  @Prop({ default: false })
  withDriver: boolean;

  @Prop({ default: 0 })
  price: number;
}

class SaleOrder {
  @Prop({ type: String })  // 'brik','mlewi','samsa','makroud','kaak'
  type: string;

  @Prop({ default: 1 })
  quantity: number;

  @Prop({ default: 'plateau' })
  unit: string;
}

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  /* ── Event info ── */
  @Prop({ enum: ['wedding', 'henna', 'concert', 'conference'], required: true })
  eventType: string;

  @Prop({ required: true })
  eventDate: Date;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true, min: 1 })
  guestCount: number;

  @Prop({ type: Types.ObjectId, ref: 'Hall' })
  hallId: Types.ObjectId;

  /* ── Standard services & products ── */
  @Prop([{
    servicePackId: { type: Types.ObjectId, ref: 'Service' },
    quantity: { type: Number, default: 1 },
    subtotal: Number
  }])
  services: any[];

  @Prop([{
    productId: { type: Types.ObjectId, ref: 'Product' },
    quantity: Number,
    subtotal: Number
  }])
  products: any[];

  /* ── Extra add-on services ── */
  @Prop({ type: JuiceOrder, default: null })
  juiceOrder: JuiceOrder;

  @Prop({ type: CarRental, default: null })
  carRental: CarRental;

  @Prop({ type: [SaleOrder], default: [] })
  saleOrders: SaleOrder[];

  /* ── Pricing ── */
  @Prop({ required: true, min: 0 })
  totalPrice: number;

  @Prop({ required: true, min: 0 })
  depositAmount: number;

  @Prop({ default: false })
  depositPaid: boolean;

  @Prop({ required: true, min: 0 })
  remainingAmount: number;

  @Prop({ default: false })
  remainingPaid: boolean;

  @Prop()
  paymentMethod: string;

  /* ── Status workflow ── */
  @Prop({
    enum: ['Pending', 'OwnerApproved', 'OwnerRejected', 'AdminValidated', 
           'AdminRejected', 'AwaitingPayment', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending',
  })
  status: string;

  /* ── Rejection / notes ── */
  @Prop()
  ownerNote: string;

  @Prop()
  adminNote: string;

  @Prop()
  clientNote: string;

  /* ── Legal ── */
  @Prop({ required: true })
  nationalId: string;

  @Prop({ default: false })
  acceptedTerms: boolean;

  @Prop()
  notes: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);