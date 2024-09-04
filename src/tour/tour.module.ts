import { Module } from '@nestjs/common';
import { TourController } from './tour.controller';
import { TourService } from './tour.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tours } from 'src/entities/tours.entity';
import { Locations } from 'src/entities/locations.entity';
import { TourServices } from 'src/entities/tour_services.entity';
import { Services } from 'src/entities/services.entity';
import { Reviews } from 'src/entities/reviews.entity';
import { Bookings } from 'src/entities/bookings.entity';
import { Payments } from 'src/entities/payments.entity';
import { Booking_Details } from 'src/entities/booking_details.entity';
import { Users } from 'src/entities/users.enity';

@Module({
  imports: [TypeOrmModule.forFeature([Tours, Locations, TourServices, Services, Reviews, Bookings, Payments, Booking_Details, Users])],
  controllers: [TourController],
  providers: [TourService]
})
export class TourModule {}
