import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as cookieSession from 'cookie-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // app.use(cookieParser(), session({
  //   name: 'WEBLS_SESSION',
  //   secret: 'TODO-PLEASE_CHANGE_LOCATION_OF_TOKEN',
  //   resave: false,
  //   saveUninitialized: false,
  //   cookie: {
  //     maxAge: 10 * (1000 * 60), // * (1000 * 60) is to convert it into minutes
  //     secure: false,
  //     httpOnly: true,
  //   }
  // }))
  app.use(
    cookieParser('TODO_PLEASE_CHANGE_LOCATION_OF_TOKEN'),
    cookieSession({
      name: 'webls_session',
      keys: ['TODO_PLEASE_CHANGE_LOCATION_OF_TOKEN'],
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      secure: false, // Set to true in production if using HTTPS
      signed: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
