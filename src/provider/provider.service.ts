import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Locations } from 'src/entities/locations.entity';
import { Services } from 'src/entities/services.entity';
import { TourServices } from 'src/entities/tour_services.entity';
import { Tours } from 'src/entities/tours.entity';
import { Users } from 'src/entities/users.enity';
import { In, Repository } from 'typeorm';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(Tours) private toursRepository: Repository<Tours>,
    @InjectRepository(TourServices) private tourServicesRepository: Repository<TourServices>,
    @InjectRepository(Services) private servicesRepository: Repository<Services>,
    @InjectRepository(Locations) private locationsRepository: Repository<Locations>,
  ) {}

  async showListProvider(searchProvider: string) {
    var data;
    if (searchProvider) {

      searchProvider = searchProvider.trim().toLowerCase();

      const getAllProviders = await this.usersRepository.createQueryBuilder('user')
        .where('user.role = :role', { role: 'provider' })
        .andWhere('LOWER(user.name) LIKE :searchProvider', { searchProvider: `%${searchProvider}%` })
        .getMany();

      data = getAllProviders;
    } else {
      var getAllProviders = await this.usersRepository.find({
        where: {
          role: 'provider'
        }
      });
      data = getAllProviders;
    }

    return data;
  }

  async showDetailProvider(id: number) {
    // Lấy thông tin user và số lượng tour mà user đó bán
    const user = await this.usersRepository.findOne({
      where: { user_id: id },
    });
  
    if (!user) {
      throw new NotFoundException(`Provider with ID ${id} not found`);
    }
  
    // Đếm số lượng tour mà user đó bán
    const tourCount = await this.toursRepository.count({ where: { user_id: id } });
  
    // Lấy ra top 4 tour được đăng gần nhất của user đó
    const recentTours = await this.toursRepository.find({
      where: { user_id: id },
      order: { createdAt: 'DESC' },
      take: 4,
    });
  
    // Kết hợp thông tin user, số lượng tour và top 4 tour vào một object và trả về
    return {
      user: user,
      tourCount: tourCount,
      recentTours: recentTours,
    };
  }
  
  async manageTour(id: number) {
    const tours = await this.toursRepository.createQueryBuilder('tour')
      .leftJoin('Locations', 'location', 'tour.location_id = location.location_id')
      .select([
        'tour.tour_id',
        'tour.tour_name',
        'location.location_name',
        'tour.price',
        'tour.start_date',
        'tour.end_date',
        'tour.availability'  // Thêm cột availability vào danh sách select
      ])
      .where('tour.user_id = :id', { id })
      .orderBy('tour.createdAt', 'DESC')
      .getRawMany();
  
    // Định dạng lại ngày cho mỗi tour
    const formattedTours = tours.map(tour => ({
      ...tour,
      tour_start_date: this.formatDate(tour.tour_start_date),
      tour_end_date: this.formatDate(tour.tour_end_date)
    }));
  
    return formattedTours;
  }
  
  // Hàm định dạng ngày từ YYYY-MM-DD sang dd/mm/yyyy
  private formatDate(date: string): string {
    const parsedDate = new Date(date);
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên cần +1
    const year = parsedDate.getFullYear();
    return `${day}/${month}/${year}`;
  }  

  async locationsManagement(id: number) {
    // Tìm các tour thuộc về user có user_id là id
    const tours = await this.toursRepository.find({
      where: { user_id: id },
    });
  
    // Lấy danh sách các location_id từ các tour
    const locationIds = tours.map(tour => tour.location_id);
  
    if (locationIds.length === 0) {
      return []; // Trả về mảng rỗng nếu không có location_id nào
    }
  
    // Tìm các location theo danh sách location_id
    const locations = await this.locationsRepository.findByIds(locationIds);
  
    // Thêm thuộc tính tour_id vào từng location
    const locationsWithTourId = locations.map(location => {
      const tour = tours.find(tour => tour.location_id === location.location_id);
      return {
        ...location,
        tour_id: tour ? tour.tour_id : null, // Gắn tour_id vào location
      };
    });
  
    return locationsWithTourId;
  }  

  async servicesManagement(id: number) {
    // Lấy danh sách các tour có user_id = id
    const tours = await this.toursRepository.find({
      where: { user_id: id },
    });

    // Lấy danh sách tour_id từ danh sách tours
    const tourIds = tours.map(tour => tour.tour_id);

    // Lấy danh sách các TourServices dựa trên tour_id
    const tourServices = await this.tourServicesRepository.find({
      where: { tour_id: In(tourIds) },
    });

    // Lấy danh sách các service_id từ tourServices
    const serviceIds = tourServices.map(tourService => tourService.service_id);

    // Lấy danh sách các service dựa trên service_id
    const services = await this.servicesRepository.findByIds(serviceIds);

    // Thêm thuộc tính tour_id vào từng service
    const servicesWithTourId = services.map(service => {
      const tourService = tourServices.find(ts => ts.service_id === service.service_id);
      return {
        ...service,
        tour_id: tourService?.tour_id,
      };
    });

    return servicesWithTourId;
  }
}
