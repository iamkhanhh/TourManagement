import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tours } from 'src/entities/tours.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TourService {
  constructor(
    @InjectRepository(Tours) private toursRepository: Repository<Tours>,
  ) {}

  async showListTour(searchLocation: string) {
    if (searchLocation) {
      console.log('searchLocation: ', searchLocation);
    } else {
      console.log('khong searchLocation');
      
    }
  }
}
