import { Module } from '@nestjs/common';
import { TourController } from './tour.controller';
import { TourService } from './tour.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tours } from 'src/entities/tours.entity';
import { Locations } from 'src/entities/locations.entity';
import { TourServices } from 'src/entities/tour_services.entity';
import { Services } from 'src/entities/services.entity';
import { Reviews } from 'src/entities/reviews.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tours, Locations, TourServices, Services, Reviews])],
  controllers: [TourController],
  providers: [TourService]
})
export class TourModule {}
