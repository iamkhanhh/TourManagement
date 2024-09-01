import { Module } from '@nestjs/common';
import { ProviderController } from './provider.controller';
import { ProviderService } from './provider.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.enity';
import { Tours } from 'src/entities/tours.entity';
import { TourServices } from 'src/entities/tour_services.entity';
import { Services } from 'src/entities/services.entity';
import { Locations } from 'src/entities/locations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Tours, TourServices, Services, Locations])],
  controllers: [ProviderController],
  providers: [ProviderService]
})
export class ProviderModule {}
