import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.enity';
import { Tours } from 'src/entities/tours.entity';
import { Locations } from 'src/entities/locations.entity';
import { TourServices } from 'src/entities/tour_services.entity';
import { Services } from 'src/entities/services.entity';
import { Reviews } from 'src/entities/reviews.entity';
import { Bookings } from 'src/entities/bookings.entity';
import { Booking_Details } from 'src/entities/booking_details.entity';
import { Payments } from 'src/entities/payments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Tours, Locations, TourServices, Services, Reviews, Bookings, Booking_Details, Payments])],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
