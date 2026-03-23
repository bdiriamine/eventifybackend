import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type ProductDocument = Product & Document;
@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true }) name: string;
  @Prop() description: string;
  @Prop({ required: true }) price: number;
  @Prop({ default: '/unité' }) priceUnit: string;
  @Prop({ default: '📦' }) icon: string;
  @Prop() category: string;
  @Prop({ default: 0 }) stock: number;
  @Prop([String]) images: string[];
  @Prop({ default: true }) rentalAvailable: boolean;
  @Prop({ default: true }) isActive: boolean;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
