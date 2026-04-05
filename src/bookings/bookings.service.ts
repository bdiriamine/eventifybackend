import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from './booking.schema';

const DEPOSIT_RATIO = 0.70;

/* Car rental pricing */
const CAR_PRICES: Record<string, Record<string, number>> = {
  berline:   { 'half-day': 80,  'full-day': 150, weekend: 280 },
  SUV:       { 'half-day': 120, 'full-day': 220, weekend: 400 },
  minivan:   { 'half-day': 100, 'full-day': 180, weekend: 340 },
  limousine: { 'half-day': 200, 'full-day': 380, weekend: 700 },
};
const JUICE_PRICE_PER_LITER = 8; // TND
const SALE_PRICES: Record<string, number> = {
  brik: 15, mlewi: 12, samsa: 20, makroud: 10, kaak: 8,
};

@Injectable()
export class BookingsService {
  constructor(@InjectModel(Booking.name) private model: Model<BookingDocument>) {}

  /* ── Create booking (status = Pending → awaiting owner approval) ── */
  async create(userId: string, data: any): Promise<BookingDocument> {
    if (!data.eventType) throw new BadRequestException('eventType is required');
    if (!data.eventDate) throw new BadRequestException('eventDate is required');
    if (!data.location)  throw new BadRequestException('location is required');
    if (!data.guestCount || Number(data.guestCount) < 1) throw new BadRequestException('guestCount >= 1');
    if (!data.nationalId) throw new BadRequestException('nationalId is required');

    let totalPrice = Number(data.hallPrice) || 0;

    /* Standard services */
    const services: any[] = [];
    if (Array.isArray(data.services)) {
      for (const s of data.services) {
        const id = s.servicePackId || s._id;
        if (!id) continue;
        services.push({
          servicePackId: Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : undefined,
          quantity: Number(s.quantity) || 1,
          subtotal: Number(s.subtotal) || 0,
        });
        totalPrice += Number(s.subtotal) || 0;
      }
    }

    /* Juice order */
    let juiceOrder: any = null;
    if (data.juiceOrder?.juices?.length) {
      const juices = data.juiceOrder.juices.map((j: any) => ({
        type: j.type,
        liters: Number(j.liters) || 1,
      }));
      const totalLiters = juices.reduce((s: number, j: any) => s + j.liters, 0);
      const subtotal = totalLiters * JUICE_PRICE_PER_LITER;
      juiceOrder = { juices, totalLiters, subtotal };
      totalPrice += subtotal;
    }

    /* Car rental */
    let carRental: any = null;
    if (data.carRental?.type) {
      const price = (CAR_PRICES[data.carRental.type]?.[data.carRental.duration] ?? 0)
        + (data.carRental.withDriver ? 50 : 0);
      carRental = {
        type: data.carRental.type,
        duration: data.carRental.duration || 'full-day',
        withDriver: Boolean(data.carRental.withDriver),
        price,
      };
      totalPrice += price;
    }

    /* Salé orders */
    const saleOrders: any[] = [];
    if (Array.isArray(data.saleOrders)) {
      for (const s of data.saleOrders) {
        if (!s.type || !s.quantity) continue;
        saleOrders.push({ type: s.type, quantity: Number(s.quantity), unit: s.unit || 'plateau' });
        totalPrice += (SALE_PRICES[s.type] ?? 15) * Number(s.quantity);
      }
    }

    const depositAmount   = Math.round(totalPrice * DEPOSIT_RATIO);
    const remainingAmount = totalPrice - depositAmount;

    const payload: any = {
      userId:       new Types.ObjectId(userId),
      eventType:    data.eventType,
      eventDate:    new Date(data.eventDate),
      location:     data.location,
      guestCount:   Number(data.guestCount),
      nationalId:   data.nationalId,
      acceptedTerms: Boolean(data.acceptedTerms),
      clientNote:   data.clientNote || data.notes || '',
      totalPrice,
      depositAmount,
      remainingAmount,
      depositPaid:  false,
      remainingPaid: false,
      status: 'Pending',   // ← always starts as Pending
      services,
      juiceOrder,
      carRental,
      saleOrders,
    };

    if (data.hallId && Types.ObjectId.isValid(data.hallId)) {
      payload.hallId = new Types.ObjectId(data.hallId);
    }

    const booking = await this.model.create(payload);
    return this.findById(booking._id.toString());
  }

  /* ── Owner: approve or reject ── */
  async ownerDecision(id: string, ownerId: string, approved: boolean, note?: string): Promise<BookingDocument> {
    const b = await this.model.findById(id).populate('hallId');
    if (!b) throw new NotFoundException();
    if (b.status !== 'Pending') throw new BadRequestException('Booking is not pending');
    const hall = b.hallId as any;
    if (hall?.managerId?.toString() !== ownerId) throw new ForbiddenException('Not your hall');
    b.status    = approved ? 'OwnerApproved' : 'OwnerRejected';
    b.ownerNote = note || '';
    await b.save();
    return this.findById(id);
  }

  /* ── Admin: validate or reject ── */
  async adminDecision(id: string, approved: boolean, note?: string): Promise<BookingDocument> {
    const b = await this.model.findById(id);
    if (!b) throw new NotFoundException();
    if (b.status !== 'OwnerApproved') throw new BadRequestException('Booking must be owner-approved first');
    b.status    = approved ? 'AwaitingPayment' : 'AdminRejected';
    b.adminNote = note || '';
    await b.save();
    return this.findById(id);
  }

  /* ── Client: pay deposit ── */
  async payDeposit(id: string, userId: string, paymentMethod: string): Promise<BookingDocument> {
    const b = await this.model.findOne({ _id: id, userId });
    if (!b) throw new NotFoundException();
    if (b.status !== 'AwaitingPayment') throw new BadRequestException('Booking is not awaiting payment');
    b.depositPaid   = true;
    b.paymentMethod = paymentMethod;
    b.status        = 'Confirmed';
    await b.save();
    return this.findById(id);
  }

  /* ── Admin: generic status override ── */
  async updateStatus(id: string, status: string, userRole: string): Promise<BookingDocument> {
    const allowed = ['Pending','OwnerApproved','OwnerRejected','AdminValidated','AdminRejected','AwaitingPayment','Confirmed','Completed','Cancelled'];
    if (!allowed.includes(status)) throw new BadRequestException('Invalid status');
    if (!['admin','manager'].includes(userRole)) throw new ForbiddenException();
    const b = await this.model.findByIdAndUpdate(id, { status }, { new: true });
    if (!b) throw new NotFoundException();
    return this.findById(id);
  }

  /* ── Pay remaining ── */
  async payRemaining(id: string, userId: string): Promise<BookingDocument> {
    const b = await this.model.findOne({ _id: id, userId });
    if (!b) throw new NotFoundException();
    b.remainingPaid = true;
    b.status = 'Completed';
    await b.save();
    return this.findById(id);
  }

  /* ── Queries ── */
  async findAll(query?: any): Promise<BookingDocument[]> {
    const filter: any = {};
    if (query?.status)    filter.status    = query.status;
    if (query?.eventType) filter.eventType = query.eventType;
    if (query?.hallId)    filter.hallId    = new Types.ObjectId(query.hallId);
    return this.model.find(filter)
      .populate('userId', 'name email phone nationalId')
      .populate('hallId', 'name location price managerId')
      .populate('services.servicePackId', 'name category price')
      .sort({ createdAt: -1 });
  }

  async findByUser(userId: string): Promise<BookingDocument[]> {
    return this.model.find({ userId: new Types.ObjectId(userId) })
      .populate('hallId', 'name location images price')
      .populate('services.servicePackId', 'name category price priceUnit')
      .sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<BookingDocument> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid booking ID');
    const b = await this.model.findById(id)
      .populate('userId', 'name email phone nationalId city')
      .populate('hallId', 'name location price images managerId')
      .populate('services.servicePackId', 'name category price priceUnit features');
    if (!b) throw new NotFoundException('Booking not found');
    return b;
  }

  async getAnalytics() {
    const [total, pending, ownerPending, revenue, byType, byMonth] = await Promise.all([
      this.model.countDocuments(),
      this.model.countDocuments({ status: 'Pending' }),
      this.model.countDocuments({ status: 'OwnerApproved' }),
      this.model.aggregate([{ $match: { depositPaid: true } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
      this.model.aggregate([{ $group: { _id: '$eventType', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      this.model.aggregate([
        { $match: { depositPaid: true } },
        { $group: { _id: { $month: '$createdAt' }, revenue: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);
    return { total, pending, ownerPending, revenue: revenue[0]?.total || 0, byType, byMonth };
  }
}
