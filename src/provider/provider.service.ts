import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.enity';
import { Repository } from 'typeorm';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
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
      console.log(getAllProviders);
      data = getAllProviders;
    }

    return data;
  }

  async showDetailProvider(id: number) {
    return id
  }
}
