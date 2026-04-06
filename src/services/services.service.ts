import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from './service.schema';

const VALID_CATEGORIES = ['photography','decoration','catering','drinks','servers','entertainment'];

@Injectable()
export class ServicesService {
  constructor(@InjectModel(Service.name) private model: Model<ServiceDocument>) {}

  async findAll(adminMode = false): Promise<ServiceDocument[]> {
    const filter = adminMode ? {} : { isActive: true };
    return this.model.find(filter).sort({ category: 1, price: 1 });
  }

  async findById(id: string): Promise<ServiceDocument> {
    const s = await this.model.findById(id);
    if (!s) throw new NotFoundException('Service not found');
    return s;
  }

  async create(data: any): Promise<ServiceDocument> {
    if (!data.name)     throw new BadRequestException('name is required');
    if (!data.category) throw new BadRequestException('category is required');
    if (!VALID_CATEGORIES.includes(data.category)) {
      throw new BadRequestException(`category must be one of: ${VALID_CATEGORIES.join(', ')}`);
    }
    if (data.price === undefined) throw new BadRequestException('price is required');

    return this.model.create({
      name:        data.name,
      description: data.description || '',
      price:       Number(data.price),
      priceUnit:   data.priceUnit || '',
      category:    data.category,
      features:    Array.isArray(data.features) ? data.features : [],
      images:      Array.isArray(data.images) ? data.images : [],
      eventTypes:  Array.isArray(data.eventTypes) ? data.eventTypes : [],
      isActive:    true,
    });
  }

  async update(id: string, data: any): Promise<ServiceDocument> {
    if (data.category && !VALID_CATEGORIES.includes(data.category)) {
      throw new BadRequestException(`category must be one of: ${VALID_CATEGORIES.join(', ')}`);
    }
    const update: any = {};
    if (data.name        !== undefined) update.name        = data.name;
    if (data.description !== undefined) update.description = data.description;
    if (data.price       !== undefined) update.price       = Number(data.price);
    if (data.priceUnit   !== undefined) update.priceUnit   = data.priceUnit;
    if (data.category    !== undefined) update.category    = data.category;
    if (data.features    !== undefined) update.features    = data.features;
    if (data.eventTypes  !== undefined) update.eventTypes  = data.eventTypes;
    if (data.isActive    !== undefined) update.isActive    = Boolean(data.isActive);
    if (data.images      !== undefined) update.images      = Array.isArray(data.images) ? data.images.filter(Boolean) : [];

    const s = await this.model.findByIdAndUpdate(id, update, { new: true });
    if (!s) throw new NotFoundException('Service not found');
    return s;
  }

  async delete(id: string): Promise<void> {
    const s = await this.model.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!s) throw new NotFoundException('Service not found');
  }
}
