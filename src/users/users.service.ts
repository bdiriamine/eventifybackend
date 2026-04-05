import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: Partial<User>): Promise<UserDocument> {
    return this.userModel.create(data);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<UserDocument> {
    const u = await this.userModel.findById(id);
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select('-password').sort({ createdAt: -1 });
  }

  async findByRole(role: string): Promise<UserDocument[]> {
    return this.userModel.find({ role }).select('-password').sort({ name: 1 });
  }

  async update(id: string, data: Partial<User>): Promise<UserDocument> {
    const u = await this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .select('-password');
    if (!u) throw new NotFoundException('User not found');
    return u;
  }
}
