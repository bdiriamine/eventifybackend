import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private model: Model<ProductDocument>) {}

  async findAll(adminMode = false): Promise<ProductDocument[]> {
    const filter = adminMode ? {} : { isActive: true };
    return this.model.find(filter).sort({ category: 1, name: 1 });
  }

  async findById(id: string): Promise<ProductDocument> {
    const p = await this.model.findById(id);
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }

  async create(data: any): Promise<ProductDocument> {
    if (!data.name)  throw new BadRequestException('name is required');
    if (data.price === undefined) throw new BadRequestException('price is required');
    return this.model.create({
      name:            data.name,
      description:     data.description || '',
      price:           Number(data.price),
      priceUnit:       data.priceUnit || '/unité',
      category:        data.category || 'Autre',
      stock:           Number(data.stock) || 0,
      images:          Array.isArray(data.images) ? data.images.filter(Boolean) : [],
      rentalAvailable: data.rentalAvailable !== false,
      isActive:        true,
    });
  }

  async update(id: string, data: any): Promise<ProductDocument> {
    const update: any = {};
    if (data.name            !== undefined) update.name            = data.name;
    if (data.description     !== undefined) update.description     = data.description;
    if (data.price           !== undefined) update.price           = Number(data.price);
    if (data.priceUnit       !== undefined) update.priceUnit       = data.priceUnit;
    if (data.category        !== undefined) update.category        = data.category;
    if (data.stock           !== undefined) update.stock           = Number(data.stock);
    if (data.rentalAvailable !== undefined) update.rentalAvailable = Boolean(data.rentalAvailable);
    if (data.isActive        !== undefined) update.isActive        = Boolean(data.isActive);
    if (data.images          !== undefined) update.images = Array.isArray(data.images)
      ? data.images.filter(Boolean) : [];

    const p = await this.model.findByIdAndUpdate(id, update, { new: true });
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }

  async delete(id: string): Promise<void> {
    const p = await this.model.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!p) throw new NotFoundException('Product not found');
  }
}
