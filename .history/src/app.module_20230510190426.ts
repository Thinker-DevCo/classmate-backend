import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PersonalInfoModule } from './personal-info/personal-info.module';
import * as cookieParser from 'cookie-parser';
import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore, // Cast redisStore to any
      host: 'localhost',
      port: 6379,
      ttl: 50,
    }),
    UserModule,
    PrismaModule,
    AuthModule,
    PersonalInfoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
