import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin',
  MANAGER = 'manager',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true }) name: string;
  @Prop({ required: true, unique: true, lowercase: true }) email: string;
  @Prop({ required: true }) password: string;
  @Prop({ enum: UserRole, default: UserRole.CLIENT }) role: UserRole;
  @Prop() nationalId: string;
  @Prop() phone: string;
  @Prop() city: string;
  @Prop() avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);