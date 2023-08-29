import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import fastifyCookie from 'fastify-cookie';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  // const app = await NestFactory.create<NestFastifyApplication>(
  //   AppModule,
  //   new FastifyAdapter(),
  // );
  const app = await NestFactory.create(AppModule);
  // app.register(fastifyCookie, {
  //   secret: 'somesupersecretcookiestuff',
  // });
  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(cookieParser());
  await app.listen(8000);
}
bootstrap();
