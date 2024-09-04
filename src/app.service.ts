import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Users } from './entities/users.enity';
import { Bookings } from './entities/bookings.entity';
import { Payments } from './entities/payments.entity';
import { Booking_Details } from './entities/booking_details.entity';
import { Tours } from './entities/tours.entity';

@Injectable()
export class AppService {

  constructor(
    private jwtService: JwtService,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(Bookings) private bookingsRepository: Repository<Bookings>,
    @InjectRepository(Payments) private paymentsRepository: Repository<Payments>,
    @InjectRepository(Booking_Details) private booking_DetailsRepository: Repository<Booking_Details>,
  ) {}

  async verifyToken(access_token: string) {
    return await this.jwtService.verifyAsync(access_token, { secret: process.env.JWT_SECRET_KEY })
  }

  async myAccount(userID: number) {
    // 1. Lấy thông tin người dùng từ bảng Users
    const account = await this.usersRepository.findOne({ where: { user_id: userID } });
  
    if (!account) {
      throw new Error('User not found');
    }
  
    // 2. Lấy thông tin booking từ bảng Bookings và Booking_Details
    const bookings = await this.bookingsRepository.createQueryBuilder('b')
      .leftJoinAndSelect(Booking_Details, 'bd', 'b.booking_id = bd.booking_id')
      .leftJoinAndSelect(Tours, 't', 'b.tour_id = t.tour_id')
      .where('b.user_id = :userID', { userID })
      .select([
        'b.booking_id',
        't.tour_name',
        'b.booking_date',
        'bd.number_of_people',
        'bd.notes'
      ])
      .getRawMany();
  
    // 3. Lấy thông tin payments từ bảng Payments
    const payments = await this.paymentsRepository.find({
      where: { booking_id: In(bookings.map(b => b.b_booking_id)) },
      select: ['payment_id', 'booking_id', 'amount', 'payment_method', 'status', 'payment_date'],
    });
  
    // Trả về ba mảng account, bookings và payments
    return {
      account,
      bookings,
      payments,
    };
  }
}
