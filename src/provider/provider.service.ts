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
    if (searchProvider) {
      console.log('searchProvider: ', searchProvider);
    } else {
      console.log('khong searchProvider');
      
    }
  }
}
