import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as methodOverride from 'method-override';
import * as hbs from 'express-handlebars';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  app.setViewEngine('hbs');
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    index: false,
    prefix: '/public',
  });
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  app.engine(
    'hbs',
    hbs.engine({
      extname: 'hbs',
      defaultLayout: 'main',
      layoutsDir: join(__dirname, '..', 'views', 'layouts'),
      partialsDir: join(__dirname, '..', 'views', 'partials'),
      helpers: {
        sum: (a, b) => a + b,
        eachStar: (rating, options) => {
          let result = '';
          for (let i = 0; i < rating; i++) {
            result += options.fn();
          }
          return result;
        },
        eachEmptyStar: (rating, options) => {
          let result = '';
          for (let i = 0; i < 5 - rating; i++) {
            result += options.fn();
          }
          return result;
        },
        ifEquals: (arg1, arg2, options) => {
          (arg1 === arg2) ? options.fn(this) : options.inverse(this)
        },
      },
    })
  );

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  app.use(methodOverride('_method'));

  app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));

  await app.listen(3000);
}
bootstrap();
