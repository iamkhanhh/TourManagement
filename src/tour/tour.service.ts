import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { get } from 'http';
import { Tours } from 'src/entities/tours.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TourService {
  constructor(
    @InjectRepository(Tours) private toursRepository: Repository<Tours>,
  ) {}

  async showListTour(where: string, when: string) {
    if (where && when) {
      console.log('where: ', where);
      console.log('when: ', when);
    } else if (where) {
      console.log('where: ', where);
    } else if (when) {
      console.log('when: ', when);
    } else {
      var getAllTours = await this.toursRepository.find({});
      console.log(getAllTours);

      return getAllTours;
    }
  }

  async showDetailTour(id: number) {
    return id
  }
}
