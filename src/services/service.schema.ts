import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type ServiceDocument = Service & Document;
@Schema({ timestamps: true })
export class Service {
  @Prop({ required: true }) name: string;
  @Prop() description: string;
  @Prop({ required: true }) price: number;
  @Prop() priceUnit: string;
  @Prop({ enum: ['photography','decoration','catering','drinks','servers','entertainment'], required: true }) category: string;
  @Prop([String]) features: string[];
  @Prop([String]) images: string[];
  @Prop([String]) eventTypes: string[];
  @Prop({ default: true }) isActive: boolean;
}
export const ServiceSchema = SchemaFactory.createForClass(Service);
