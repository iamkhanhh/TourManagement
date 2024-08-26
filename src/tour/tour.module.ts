import { Module } from '@nestjs/common';
import { TourController } from './tour.controller';
import { TourService } from './tour.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tours } from 'src/entities/tours.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tours])],
  controllers: [TourController],
  providers: [TourService]
})
export class TourModule {}
