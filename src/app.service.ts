import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Users } from './entities/users.enity';
import { Bookings } from './entities/bookings.entity';
import { Payments } from './entities/payments.entity';
import { Booking_Details } from './entities/booking_details.entity';
import { Tours } from './entities/tours.entity';
import { UpdateAccDto } from './dto/updateAcc.dto';
import * as bcrypt from 'bcrypt';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class AppService implements OnModuleInit {
  data_books = [];

  constructor(
    private jwtService: JwtService,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(Bookings) private bookingsRepository: Repository<Bookings>,
    @InjectRepository(Payments) private paymentsRepository: Repository<Payments>,
    @InjectRepository(Booking_Details) private booking_DetailsRepository: Repository<Booking_Details>,
  ) {}

  async onModuleInit() {
    await this.loadBooksData();
  }

  async loadBooksData() {
    try {
      // Đọc file db.json với dấu gạch chéo xuôi
      const data = await fs.readFile("db.json", 'utf-8');
      
      // Chuyển đổi chuỗi JSON sang object
      const booksData = JSON.parse(data);
  
      // Gán dữ liệu books vào this.data_books
      this.data_books = booksData.books;
    } catch (error) {
      console.error('Error fetching books data:', error);
    }
  }  

  getBooks() {
    return this.data_books;
  }

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

  async updateAccount(updateAccDto: UpdateAccDto, userID: number) {
    // Tìm kiếm người dùng dựa vào ID
    const user = await this.usersRepository.findOneBy({ user_id: userID });

    // Nếu không tìm thấy người dùng, ném ra ngoại lệ
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Cập nhật username và email nếu có thay đổi
    user.username = updateAccDto.user_name as string;
    user.email = updateAccDto.email as string;

    // Nếu thông tin mật khẩu được gửi kèm
    if (
      updateAccDto.currentPassword &&
      updateAccDto.newPassword &&
      updateAccDto.confirmPassword
    ) {
      // So sánh mật khẩu hiện tại với mật khẩu đã mã hóa trong cơ sở dữ liệu
      const isPasswordMatching = await bcrypt.compare(updateAccDto.currentPassword  as string, user.password);
      if (!isPasswordMatching) {
        throw new BadRequestException('Current password is incorrect');
      }

      // Kiểm tra xem mật khẩu mới và xác nhận mật khẩu có trùng khớp không
      if (updateAccDto.newPassword !== updateAccDto.confirmPassword) {
        throw new BadRequestException('New password and confirm password do not match');
      }

      // Mã hóa mật khẩu mới
      const hashedPassword = await bcrypt.hash(updateAccDto.newPassword  as string, 12);

      // Cập nhật mật khẩu mới
      user.password = hashedPassword;
    }

    // Cập nhật thông tin người dùng vào cơ sở dữ liệu
    await this.usersRepository.save(user);

    return {
      message: 'Account updated successfully',
    };
  }
}
