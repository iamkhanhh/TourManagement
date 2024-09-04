import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from './middleware/auth.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookings } from './entities/bookings.entity';
import { Locations } from './entities/locations.entity';
import { Payments } from './entities/payments.entity';
import { Reviews } from './entities/reviews.entity';
import { Services } from './entities/services.entity';
import { TourServices } from './entities/tour_services.entity';
import { Tours } from './entities/tours.entity';
import { Users } from './entities/users.enity';
import { TourModule } from './tour/tour.module';
import { ProviderModule } from './provider/provider.module';
import { AdminModule } from './admin/admin.module';
import { Booking_Details } from './entities/booking_details.entity';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      // host: 'mysqldb',
      port: 3306,  
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Users, Tours, TourServices, Services, Reviews, Payments, Locations, Bookings, Booking_Details],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Users, Payments, Bookings, Booking_Details]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
    TourModule,
    ProviderModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('*'); // Áp dụng middleware cho tất cả các route
  }
}