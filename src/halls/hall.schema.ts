import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type HallDocument = Hall & Document;
@Schema({ timestamps: true })
export class Hall {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) location: string;
  @Prop({ required: true }) capacity: number;
  @Prop({ required: true }) price: number;
  @Prop() description: string;
  @Prop([String]) images: string[];
  @Prop([String]) availabilityCalendar: string[];
  @Prop({ type: Types.ObjectId, ref: 'User' }) managerId: Types.ObjectId;
  @Prop({ default: 0 }) rating: number;
  @Prop({ default: 0 }) reviewCount: number;
  @Prop([String]) tags: string[];
  @Prop({ default: true }) isActive: boolean;
}
export const HallSchema = SchemaFactory.createForClass(Hall);
