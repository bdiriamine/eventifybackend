import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from './booking.schema';

const DEPOSIT_RATIO = 0.70;

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private model: Model<BookingDocument>,
  ) {}

  async create(userId: string, data: any): Promise<BookingDocument> {
    // Validate required fields
    if (!data.eventType) throw new BadRequestException('eventType is required');
    if (!data.eventDate) throw new BadRequestException('eventDate is required');
    if (!data.location)  throw new BadRequestException('location is required');
    if (!data.guestCount || data.guestCount < 1) throw new BadRequestException('guestCount must be >= 1');
    if (!data.nationalId) throw new BadRequestException('nationalId is required');

    const totalPrice    = Number(data.totalPrice) || 0;
    const depositAmount = Math.round(totalPrice * DEPOSIT_RATIO);
    const remainingAmount = totalPrice - depositAmount;

    const payload: any = {
      userId: new Types.ObjectId(userId),
      eventType:    data.eventType,
      eventDate:    new Date(data.eventDate),
      location:     data.location,
      guestCount:   Number(data.guestCount),
      nationalId:   data.nationalId,
      acceptedTerms: Boolean(data.acceptedTerms),
      paymentMethod: data.paymentMethod || '',
      totalPrice,
      depositAmount,
      remainingAmount,
      depositPaid: true,       // deposit paid at booking time
      remainingPaid: false,
      status: 'Confirmed',
      notes: data.notes || '',
    };

    // Hall reference
    if (data.hallId && Types.ObjectId.isValid(data.hallId)) {
      payload.hallId = new Types.ObjectId(data.hallId);
    }

    // Services array
    if (Array.isArray(data.services) && data.services.length > 0) {
      payload.services = data.services
        .filter((s: any) => s.servicePackId || s._id)
        .map((s: any) => {
          const id = s.servicePackId || s._id;
          return {
            servicePackId: Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : undefined,
            quantity: Number(s.quantity) || 1,
            subtotal: Number(s.subtotal) || 0,
          };
        });
    }

    // Products array
    if (Array.isArray(data.products) && data.products.length > 0) {
      payload.products = data.products
        .filter((p: any) => p.productId)
        .map((p: any) => ({
          productId: Types.ObjectId.isValid(p.productId) ? new Types.ObjectId(p.productId) : undefined,
          quantity: Number(p.quantity) || 1,
          subtotal: Number(p.subtotal) || 0,
        }));
    }

    const booking = await this.model.create(payload);
    return booking.populate([
      { path: 'hallId', select: 'name location price' },
    ]);
  }

  async findAll(query?: any): Promise<BookingDocument[]> {
    const filter: any = {};
    if (query?.status)    filter.status    = query.status;
    if (query?.eventType) filter.eventType = query.eventType;
    if (query?.hallId)    filter.hallId    = query.hallId;

    return this.model
      .find(filter)
      .populate('userId', 'name email phone nationalId')
      .populate('hallId', 'name location price')
      .populate('services.servicePackId', 'name category price')
      .sort({ createdAt: -1 });
  }

  async findByUser(userId: string): Promise<BookingDocument[]> {
    return this.model
      .find({ userId: new Types.ObjectId(userId) })
      .populate('hallId', 'name location images price')
      .populate('services.servicePackId', 'name category price priceUnit')
      .sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<BookingDocument> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid booking ID');
    const b = await this.model
      .findById(id)
      .populate('userId', 'name email phone nationalId city')
      .populate('hallId', 'name location price images')
      .populate('services.servicePackId', 'name category price priceUnit features');
    if (!b) throw new NotFoundException('Booking not found');
    return b;
  }

  async updateStatus(id: string, status: string, userRole: string): Promise<BookingDocument> {
    const allowed = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    if (!allowed.includes(status)) throw new BadRequestException('Invalid status');
    if (!['admin', 'manager'].includes(userRole)) throw new ForbiddenException();

    const b = await this.model
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate('userId', 'name email')
      .populate('hallId', 'name location');
    if (!b) throw new NotFoundException();
    return b;
  }

  async payDeposit(id: string, userId: string, paymentMethod: string): Promise<BookingDocument> {
    const b = await this.model.findOne({ _id: id, userId });
    if (!b) throw new NotFoundException();
    b.depositPaid  = true;
    b.paymentMethod = paymentMethod;
    b.status       = 'Confirmed';
    await b.save();
    return b;
  }

  async payRemaining(id: string, userId: string, paymentMethod: string): Promise<BookingDocument> {
    const b = await this.model.findOne({ _id: id, userId });
    if (!b) throw new NotFoundException();
    b.remainingPaid = true;
    b.status = 'Completed';
    await b.save();
    return b;
  }

  async getAnalytics() {
    const [total, pending, revenue, byType, byMonth] = await Promise.all([
      this.model.countDocuments(),
      this.model.countDocuments({ status: 'Pending' }),
      this.model.aggregate([
        { $match: { depositPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      this.model.aggregate([
        { $group: { _id: '$eventType', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      this.model.aggregate([
        { $match: { depositPaid: true } },
        {
          $group: {
            _id: { $month: '$createdAt' },
            revenue: { $sum: '$totalPrice' },
            count:   { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);
    return {
      total,
      pending,
      revenue: revenue[0]?.total || 0,
      byType,
      byMonth,
    };
  }
}
