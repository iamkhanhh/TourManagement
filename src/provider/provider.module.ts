import { Module } from '@nestjs/common';
import { ProviderController } from './provider.controller';
import { ProviderService } from './provider.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.enity';
import { Tours } from 'src/entities/tours.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Tours])],
  controllers: [ProviderController],
  providers: [ProviderService]
})
export class ProviderModule {}
