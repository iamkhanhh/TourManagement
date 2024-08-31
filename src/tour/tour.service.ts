import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { get } from 'http';
import { CreateLocationDto } from 'src/dto/createLocation.dto';
import { CreateServiceDto } from 'src/dto/createService.dto';
import { CreateTourDto } from 'src/dto/createTour.dto';
import { Locations } from 'src/entities/locations.entity';
import { Reviews } from 'src/entities/reviews.entity';
import { Services } from 'src/entities/services.entity';
import { TourServices } from 'src/entities/tour_services.entity';
import { Tours } from 'src/entities/tours.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TourService {
  constructor(
    @InjectRepository(Tours) private toursRepository: Repository<Tours>,
    @InjectRepository(Locations) private locationsRepository: Repository<Locations>,
    @InjectRepository(TourServices) private tourServicesRepository: Repository<TourServices>,
    @InjectRepository(Services) private servicesRepository: Repository<Services>,
    @InjectRepository(Reviews) private reviewsRepository: Repository<Reviews>,
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

    const newTour = new Tours();
    newTour.tour_name = createTourDto.tour_name.trim() as string;
    newTour.description = createTourDto.description as string;
    newTour.price = createTourDto.price;
    newTour.location_id = location_id;
    newTour.user_id = user_id;
    newTour.start_date = createTourDto.date_start;
    newTour.end_date = createTourDto.date_end;
    newTour.availability = Number(createTourDto.availability);
    await this.tourServicesRepository.save(newTour);
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

    // Lấy danh sách các service_id đi kèm với tour_id từ bảng TourServices
    const tourServices = await this.tourServicesRepository.find({ where: { tour_id: id } });

    // Lấy thông tin của các service tương ứng với các service_id vừa lấy được
    const serviceIds = tourServices.map(ts => ts.service_id);
    const services = await this.servicesRepository.findByIds(serviceIds);

    // Trả về thông tin của tour và danh sách các dịch vụ đi kèm
    return {
      tour,
      services,
    };
  }

  async showBookingTour(id: number) {
    return [];
  }

  async editService(id: number) {
    return [];
  }

  async editServicePost(createServiceDto: CreateServiceDto ,id: number) {
    return [];
  }

  async createServicePost(createServiceDto: CreateServiceDto, idTour: number) {

  }

  async editLocation(id: number) {
    return [];
  }

  async editLocationPost(createLocationDto: CreateLocationDto, id: number) {
    return [];
  }

  async createLocationPost(createLocationDto: CreateLocationDto, idTour: number) {

  }
}
