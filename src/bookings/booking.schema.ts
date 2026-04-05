import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type BookingDocument = Booking & Document;

/* Extra service sub-schemas */
const JuiceOrderSchema = {
  type: { type: String },      // 'orange','pomme','mangue','grenadine','citron'
  liters: { type: Number, default: 1 },
};
const CarRentalSchema = {
  type: { type: String },      // 'berline','SUV','minivan','limousine'
  duration: { type: String },  // 'half-day','full-day','weekend'
  withDriver: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
};
const SaleSchema = {
  type: { type: String },      // 'brik','mlewi','samsa','makroud','kaak'
  quantity: { type: Number, default: 1 }, // trays / pieces
  unit: { type: String, default: 'plateau' },
};

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) 
  userId: Types.ObjectId;

  /* ── Event info ── */
  @Prop({ enum: ['wedding','henna','concert','conference'], required: true }) 
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
  @Prop([{ servicePackId: { type: Types.ObjectId, ref: 'Service' }, quantity: { type: Number, default: 1 }, subtotal: Number }])
  services: any[];
  @Prop([{ productId: { type: Types.ObjectId, ref: 'Product' }, quantity: Number, subtotal: Number }])
  products: any[];

  /* ── Extra add-on services ── */
  // FIXED: Removed default: null - use optional or allow undefined
  @Prop({ type: { juices: [JuiceOrderSchema], totalLiters: Number, subtotal: Number } })
  juiceOrder?: any;  // Made optional with ?

  // FIXED: Removed default: null
  @Prop({ type: CarRentalSchema })
  carRental?: any;  // Made optional with ?

  // FIXED: This one is correct - default empty array is fine
  @Prop({ type: [SaleSchema], default: [] })
  saleOrders: any[];

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
    enum: ['Pending','OwnerApproved','OwnerRejected','AdminValidated','AdminRejected','AwaitingPayment','Confirmed','Completed','Cancelled'],
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