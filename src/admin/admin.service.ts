import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking_Details } from 'src/entities/booking_details.entity';
import { Bookings } from 'src/entities/bookings.entity';
import { Locations } from 'src/entities/locations.entity';
import { Payments } from 'src/entities/payments.entity';
import { Reviews } from 'src/entities/reviews.entity';
import { Services } from 'src/entities/services.entity';
import { TourServices } from 'src/entities/tour_services.entity';
import { Tours } from 'src/entities/tours.entity';
import { Users } from 'src/entities/users.enity';
import { In, Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(Tours) private toursRepository: Repository<Tours>,
    @InjectRepository(Locations) private locationsRepository: Repository<Locations>,
    @InjectRepository(TourServices) private tourServicesRepository: Repository<TourServices>,
    @InjectRepository(Services) private servicesRepository: Repository<Services>,
    @InjectRepository(Reviews) private reviewsRepository: Repository<Reviews>,
    @InjectRepository(Bookings) private bookingsRepository: Repository<Bookings>,
    @InjectRepository(Booking_Details) private booking_DetailsRepository: Repository<Booking_Details>,
    @InjectRepository(Payments) private paymentsRepository: Repository<Payments>,
  ) { }

  async dashboard(mode: string) {
    var data;
    switch (mode) {
      case 'all':
        data = await this.usersRepository.find({});
        break;
      case 'guest':
        data = await this.usersRepository.find({
          where: {
            role: 'guest',
          }
        });
        break;
      case 'provider':
        data = await this.usersRepository.find({
          where: {
            role: 'provider',
          }
        });
        break;
        data = await this.usersRepository.find({
          where: {
            role: 'Other',
          }
        });
        break;
      default:
        break;
    }

    data = data.map(user => {
      const formattedUser = { ...user };
      if (formattedUser.last_login) {
        const date = new Date(formattedUser.last_login);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = date.getFullYear();
        formattedUser.last_login = `${day}/${month}/${year}`;
      }
      return formattedUser;
    });

    return data;
  }

  async deleteUser(id: number) {
    // Xóa các reviews của user
    await this.reviewsRepository.delete({ user_id: id });

    // Lấy danh sách các booking_id liên quan đến user
    const bookings = await this.bookingsRepository.find({ where: { user_id: id } });
    const bookingIds = bookings.map(booking => booking.booking_id);

    if (bookingIds.length > 0) {
      // Xóa các booking_details liên quan đến các booking_id
      await this.booking_DetailsRepository.delete({ booking_id: In(bookingIds) });

      // Xóa các payments liên quan đến các booking_id
      await this.paymentsRepository.delete({ booking_id: In(bookingIds) });

      // Xóa các bookings của user
      await this.bookingsRepository.delete({ user_id: id });
    }

    const tours = await this.toursRepository.find({ where: { user_id: id } });
    const tourIds = tours.map(tour => tour.tour_id);

    if (tourIds.length > 0) {
      const serviceIds = await this.tourServicesRepository
        .createQueryBuilder('tour_services')
        .select('service_id')
        .where('tour_id IN (:...tourIds)', { tourIds })
        .getMany()
        .then(services => services.map(service => service.service_id));

      if (serviceIds.length > 0) {
        await this.servicesRepository.delete({ service_id: In(serviceIds) });
      }

      await this.tourServicesRepository.delete({ tour_id: In(tourIds) });

      // Xóa các tour
      await this.toursRepository.delete({ user_id: id });
    }

    // Xóa user
    await this.usersRepository.delete({ user_id: id });

    console.log(`User with ID ${id} and all related data have been deleted successfully.`);
  }

  async editUser(id: number) {
    const user = await this.usersRepository.findOne({ where: { user_id: id } });
    return user;
  }

  async editUserPost(id: number) {
    const user = await this.usersRepository.findOne({ where: { user_id: id } });
    return user;
  }
}