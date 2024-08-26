import { Module } from '@nestjs/common';
import { ProviderController } from './provider.controller';
import { ProviderService } from './provider.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.enity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [ProviderController],
  providers: [ProviderService]
})
export class ProviderModule {}
