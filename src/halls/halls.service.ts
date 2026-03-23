import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Hall, HallDocument } from './hall.schema';

@Injectable()
export class HallsService {
  constructor(@InjectModel(Hall.name) private hallModel: Model<HallDocument>) {}

  async create(data: any): Promise<HallDocument> {
    const payload: any = {
      name:        data.name,
      location:    data.location,
      capacity:    Number(data.capacity),
      price:       Number(data.price),
      description: data.description || '',
      images:      Array.isArray(data.images) ? data.images : (data.images ? [data.images] : []),
      tags:        Array.isArray(data.tags) ? data.tags : [],
      availabilityCalendar: [],
      rating:      Number(data.rating) || 0,
      reviewCount: Number(data.reviewCount) || 0,
      isActive:    true,
    };
    if (data.managerId && Types.ObjectId.isValid(data.managerId)) {
      payload.managerId = new Types.ObjectId(data.managerId);
    }
    return this.hallModel.create(payload);
  }

  async findAll(adminMode = false): Promise<HallDocument[]> {
    const filter = adminMode ? {} : { isActive: true };
    return this.hallModel.find(filter).populate('managerId', 'name email').sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<HallDocument> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid hall ID');
    const h = await this.hallModel.findById(id).populate('managerId', 'name email');
    if (!h) throw new NotFoundException('Hall not found');
    return h;
  }

  async findByManager(managerId: string): Promise<HallDocument[]> {
    return this.hallModel.find({ managerId: new Types.ObjectId(managerId), isActive: true });
  }

  async update(id: string, data: any): Promise<HallDocument> {
    const update: any = {};
    if (data.name       !== undefined) update.name       = data.name;
    if (data.location   !== undefined) update.location   = data.location;
    if (data.capacity   !== undefined) update.capacity   = Number(data.capacity);
    if (data.price      !== undefined) update.price      = Number(data.price);
    if (data.description!== undefined) update.description= data.description;
    if (data.tags       !== undefined) update.tags       = data.tags;
    if (data.isActive   !== undefined) update.isActive   = data.isActive;
    if (data.rating     !== undefined) update.rating     = Number(data.rating);
    if (data.images     !== undefined) update.images = Array.isArray(data.images) ? data.images : [data.images];
    if (data.managerId  !== undefined && Types.ObjectId.isValid(data.managerId)) {
      update.managerId = new Types.ObjectId(data.managerId);
    }

    const h = await this.hallModel.findByIdAndUpdate(id, update, { new: true });
    if (!h) throw new NotFoundException('Hall not found');
    return h;
  }

  async delete(id: string): Promise<void> {
    const h = await this.hallModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!h) throw new NotFoundException('Hall not found');
  }

  async updateAvailability(id: string, dates: string[]): Promise<HallDocument> {
    const h = await this.hallModel.findByIdAndUpdate(
      id,
      { availabilityCalendar: dates },
      { new: true }
    );
    if (!h) throw new NotFoundException('Hall not found');
    return h;
  }
}
