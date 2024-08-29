import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tours } from 'src/entities/tours.entity';
import { Users } from 'src/entities/users.enity';
import { Repository } from 'typeorm';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(Tours) private toursRepository: Repository<Tours>,
  ) {}

  async showListProvider(searchProvider: string) {
    var data;
    if (searchProvider) {

      searchProvider = searchProvider.trim().toLowerCase();

      const getAllProviders = await this.usersRepository.createQueryBuilder('user')
        .where('user.role = :role', { role: 'provider' })
        .andWhere('LOWER(user.name) LIKE :searchProvider', { searchProvider: `%${searchProvider}%` })
        .getMany();

      console.log(getAllProviders);
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
    console.log(id);
    return
  }

  async locationsManagement(id: number) {
    console.log(id);
    return
  }

  async servicesManagement(id: number) {
    console.log(id);
    return
  }
}
