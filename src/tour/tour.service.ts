import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { get } from 'http';
import { BookingDto } from 'src/dto/booking.dto';
import { CommentDto } from 'src/dto/comment.dto';
import { CreateLocationDto } from 'src/dto/createLocation.dto';
import { CreateServiceDto } from 'src/dto/createService.dto';
import { CreateTourDto } from 'src/dto/createTour.dto';
import { EditTourDto } from 'src/dto/editTour.dto';
import { Booking_Details } from 'src/entities/booking_details.entity';
import { Bookings } from 'src/entities/bookings.entity';
import { Locations } from 'src/entities/locations.entity';
import { Payments } from 'src/entities/payments.entity';
import { Reviews } from 'src/entities/reviews.entity';
import { Services } from 'src/entities/services.entity';
import { TourServices } from 'src/entities/tour_services.entity';
import { Tours } from 'src/entities/tours.entity';
import { Users } from 'src/entities/users.enity';
import { Repository } from 'typeorm';

@Injectable()
export class TourService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(Tours) private toursRepository: Repository<Tours>,
    @InjectRepository(Locations) private locationsRepository: Repository<Locations>,
    @InjectRepository(TourServices) private tourServicesRepository: Repository<TourServices>,
    @InjectRepository(Services) private servicesRepository: Repository<Services>,
    @InjectRepository(Reviews) private reviewsRepository: Repository<Reviews>,
    @InjectRepository(Bookings) private bookingsRepository: Repository<Bookings>,
    @InjectRepository(Payments) private paymentsRepository: Repository<Payments>,
    @InjectRepository(Booking_Details) private booking_DetailsRepository: Repository<Booking_Details>,
  ) { }

  async showListTour(where: string, when: string) {
    const query = this.toursRepository.createQueryBuilder('tour')
      .leftJoinAndSelect('Locations', 'location', 'tour.location_id = location.location_id');

    if (where) {
      query.andWhere('LOWER(location.location_name) LIKE :where', { where: `%${where.toLowerCase()}%` });
    }

    const date = when ? new Date(when).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    query.andWhere('tour.start_date > :date', { date });

    const tours = await query.getMany();
    return tours;
  }

  async showDetailTour(id: number) {
    // Tìm kiếm tour bằng ID và join với bảng Locations để lấy thông tin location
    const tour = await this.toursRepository.createQueryBuilder('tour')
      .leftJoinAndSelect('Locations', 'location', 'tour.location_id = location.location_id')
      .where('tour.tour_id = :id', { id })
      .getOne();

    if (!tour) {
      throw new NotFoundException(`Tour with ID ${id} not found`);
    }

    var location = await this.locationsRepository.findOneBy({ location_id: tour.location_id });
    var services = await this.getTourServices(id);
    var reviews = await this.getComments(id);

    return { tour, location, services, reviews };
  }

  async getTourServices(tour_id: number) {
    const tourServices = await this.tourServicesRepository.createQueryBuilder('tourServices')
      .select('tourServices.service_id')
      .where('tourServices.tour_id = :tour_id', { tour_id })
      .getMany();

    if (tourServices.length === 0) {
      throw new NotFoundException(`No services found for tour with ID ${tour_id}`);
    }

    const serviceIds = tourServices.map(ts => ts.service_id);

    const services = await this.servicesRepository.createQueryBuilder('services')
      .where('services.service_id IN (:...serviceIds)', { serviceIds })
      .getMany();
    return services;
  }

  async getComments(tour_id: number) {
    const reviews = await this.reviewsRepository.createQueryBuilder('reviews')
      .select(['users.username', 'reviews.rating', 'reviews.comment'])
      .leftJoin('users', 'users', 'reviews.user_id = users.user_id')
      .where('reviews.tour_id = :tour_id', { tour_id })
      .getRawMany();
    return reviews;
  }

  async createTour(createTourDto: CreateTourDto, user_id: number) {
    var location_id = await this.initSaveLocation(createTourDto.location.trim() as string)

    const newTour = this.toursRepository.create({
      tour_name: createTourDto.tour_name.trim() as string,
      description: createTourDto.description as string,
      price: Number(createTourDto.price),
      location_id: location_id,
      user_id: user_id,
      start_date: createTourDto.date_start,
      end_date: createTourDto.date_end,
      availability: Number(createTourDto.availability)
    });
    await this.toursRepository.save(newTour);
  }

  async initSaveLocation(location_name: string) {
    const newLocation = this.locationsRepository.create({ location_name });

    const savedLocation = await this.locationsRepository.save(newLocation);

    return savedLocation.location_id;
  }

  async editTour(id: number) {
    // Lấy thông tin chi tiết của tour theo tour_id
    const tour = await this.toursRepository.findOne({ where: { tour_id: id } });
    if (!tour) {
      throw new Error('Tour not found');
    }

    const location = await this.locationsRepository.findOne({ where: { location_id: tour.location_id } });

    // Lấy danh sách các service_id đi kèm với tour_id từ bảng TourServices
    const tourServices = await this.tourServicesRepository.find({ where: { tour_id: id } });

    // Lấy thông tin của các service tương ứng với các service_id vừa lấy được
    const serviceIds = tourServices.map(ts => ts.service_id);
    const services = await this.servicesRepository.findByIds(serviceIds);

    // Trả về thông tin của tour và danh sách các dịch vụ đi kèm
    return {
      tour,
      services,
      location
    };
  }

  async editTourPost(editTourDto: EditTourDto, id: number) {
    // Tìm tour theo ID
    const tour = await this.toursRepository.findOne({ where: { tour_id: id } });
    if (!tour) {
      throw new Error(`Tour with ID ${id} not found`);
    }

    // Tìm location theo ID
    const location = await this.locationsRepository.findOne({ where: { location_id: tour.location_id } });
    if (!location) {
      throw new Error(`Location with ID ${tour.location_id} not found`);
    }

    // Cập nhật thông tin tour
    tour.tour_name = editTourDto.tour_name as string;
    tour.description = editTourDto.description as string;
    tour.price = Number(editTourDto.price);
    tour.start_date = new Date(editTourDto.date_start);
    tour.end_date = new Date(editTourDto.date_end);
    tour.availability = Number(editTourDto.availability);

    // Cập nhật thông tin location
    location.location_name = editTourDto.location_name as string;
    location.description = editTourDto.description_location as string;
    location.address = editTourDto.address as string;
    location.coordinates = editTourDto.coordinates as string;

    // Lưu thay đổi
    await this.toursRepository.save(tour);
    await this.locationsRepository.save(location);

    console.log(`Tour with ID ${id} has been updated successfully.`);
  }

  async deleteTour(id: number) {
    // Tìm tour theo ID
    const tour = await this.toursRepository.findOne({ where: { tour_id: id } });
  
    if (!tour) {
      throw new Error(`Tour with ID ${id} not found`);
    }
  
    // Lấy ra các tour_services liên quan đến tour
    const tourServices = await this.tourServicesRepository.find({
      where: { tour_id: id },
    });
  
    // Xóa các tour_services liên quan trong bảng TourServices
    if (tourServices.length > 0) {
      await this.tourServicesRepository.remove(tourServices);
    }
  
    // Xóa location có location_id trong tour đó
    const location = await this.locationsRepository.findOne({
      where: { location_id: tour.location_id },
    });
  
    if (location) {
      await this.locationsRepository.remove(location);
    }
  
    // Xóa tour
    await this.toursRepository.remove(tour);
  
    // Thông báo thành công
    console.log(`Tour with ID ${id} and its related tour services and location have been deleted successfully.`);
  }   

  async deleteService(id: number) {
    // Tìm Service theo ID
    const service = await this.servicesRepository.findOne({ where: { service_id: id } });
  
    // Nếu không tìm thấy service, ném ra lỗi
    if (!service) {
      throw new Error(`Service with ID ${id} not found`);
    }
  
    // Tìm các liên kết trong bảng TourServices với service_id là id
    const tourServices = await this.tourServicesRepository.find({
      where: { service_id: id },
    });
  
    // Xóa các liên kết trong bảng TourServices
    if (tourServices.length > 0) {
      await this.tourServicesRepository.remove(tourServices);
    }
  
    // Xóa service
    await this.servicesRepository.remove(service);
  
    // Thông báo thành công
    console.log(`Service with ID ${id} has been deleted successfully.`);
  }  

  async showBookingTour(id: number) {
    const tour = await this.toursRepository.findOne({ where: { tour_id: id } });
    const location = await this.locationsRepository.findOne({ where: { location_id: tour.tour_id } });
    // Nếu không tìm thấy tour, ném ra lỗi
    if (!tour) {
      throw new Error(`tour with ID ${id} not found`);
    }

    return {tour, location}
  }

  async bookingPost(bookingDto: BookingDto, tour_id: number, user_id: number) {
  
    // Lấy thông tin về tour từ bảng Tours
    const tour = await this.toursRepository.findOne({ where: { tour_id } });
    if (!tour) {
      throw new Error('Tour not found');
    }
  
    // Kiểm tra xem availability có đủ cho số lượng yêu cầu hay không
    if (tour.availability < bookingDto.availability) {
      throw new Error('Insufficient availability for this tour');
    }
  
    // Tính toán amount dựa trên giá của tour và số lượng người
    const amount = tour.price * bookingDto.availability;
  
    // Lấy thông tin về user từ bảng Users
    const user = await this.usersRepository.findOne({ where: { user_id } });
    if (!user) {
      throw new Error('User not found');
    }
  
    // Kiểm tra xem user có đủ tiền để thanh toán không
    if (user.money < amount) {
      throw new Error('Insufficient funds');
    }
  
    // Trừ tiền trong tài khoản user
    user.money -= amount;
    await this.usersRepository.save(user);
  
    // Cập nhật availability của tour
    tour.availability -= bookingDto.availability;
    await this.toursRepository.save(tour);
  
    // Tạo bản ghi cho bảng payments trước
    const newPayment = this.paymentsRepository.create({
      amount: amount, // Sử dụng giá trị amount đã tính toán
      payment_date: new Date(),
      payment_method: 'credit_card',
      status: 'completed',
      booking_id: 0,
    });
    const savedPayment = await this.paymentsRepository.save(newPayment);
  
    const newBooking = this.bookingsRepository.create({
      user_id: user_id,
      tour_id: tour_id,
      booking_date: new Date(),
      status: 'confirmed',
      payment_id: savedPayment.payment_id, 
    });
    const savedBooking = await this.bookingsRepository.save(newBooking);
  
    savedPayment.booking_id = savedBooking.booking_id;
    await this.paymentsRepository.save(savedPayment);
  
    // Tạo bản ghi cho bảng booking_details
    const newBookingDetail = this.booking_DetailsRepository.create({
      booking_id: savedBooking.booking_id,
      tour_id: tour_id,
      user_id: user_id,
      number_of_people: bookingDto.availability,
      notes: bookingDto.description as string,
    });
    await this.booking_DetailsRepository.save(newBookingDetail);
  
    return {
      message: 'Booking completed successfully!',
      booking: savedBooking,
      bookingDetails: newBookingDetail,
      payment: savedPayment,
    };
  }  

  async commentPost(commentDto: CommentDto, tour_id: number, user_id: number) {
    const newReview = this.reviewsRepository.create({
      user_id: user_id,
      tour_id: tour_id,
      rating: Number(commentDto.rating),
      comment: commentDto.comment as string,
    });
    await this.reviewsRepository.save(newReview);
  
    console.log('New review saved successfully:', newReview);
    return newReview;
  }

  async editService(id: number) {
    // Tìm Service theo ID
    const service = await this.servicesRepository.findOne({ where: { service_id: id } });
  
    // Nếu không tìm thấy service, ném ra lỗi
    if (!service) {
      throw new Error(`Service with ID ${id} not found`);
    }

    return service
  }

  async editServicePost(createServiceDto: CreateServiceDto, id: number) {
    try {
      // Tìm kiếm service dựa trên id
      const service = await this.servicesRepository.findOne({ where: { service_id: id } });
  
      if (!service) {
        throw new Error('Service not found');
      }
  
      // Cập nhật các thuộc tính của service
      service.service_name = createServiceDto.service_name as string;
      service.description = createServiceDto.description as string;
      service.price = Number(createServiceDto.price);
      service.service_category = createServiceDto.service_category as string;
  
      // Lưu các thay đổi vào cơ sở dữ liệu
      const updatedService = await this.servicesRepository.save(service);
  
      console.log('Service updated successfully');
      return updatedService;
    } catch (error) {
      console.error('Error updating service:', error);
      throw new Error('Could not update service');
    }
  }  

  async createServicePost(createServiceDto: CreateServiceDto, idTour: number) {
    try {
      // Tạo một service mới từ DTO
      const newService = new Services();
      newService.service_name = createServiceDto.service_name as string;
      newService.description = createServiceDto.description as string;
      newService.price = Number(createServiceDto.price);
      newService.service_category = createServiceDto.service_category as string;
  
      // Lưu service vào cơ sở dữ liệu
      const savedService = await this.servicesRepository.save(newService);
  
      // Tạo một bản ghi trong bảng tour_services để liên kết service với tour
      const newTourService = new TourServices();
      newTourService.tour_id = idTour;
      newTourService.service_id = savedService.service_id;
  
      // Lưu liên kết tour-service vào cơ sở dữ liệu
      await this.tourServicesRepository.save(newTourService);
  
      return savedService;
    } catch (error) {
      console.error('Error creating service and linking with tour:', error);
      throw new Error('Could not create service or link it with the tour');
    }
  }
   
}
