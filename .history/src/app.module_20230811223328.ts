import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { RedisModule } from './redis/redis.module';
import { SchoolModule } from './school/school.module';
import { CourseService } from './course/course.service';
import { CourseModule } from './course/course.module';
import { CollegeStudentModule } from './college-student/college-student.module';
import { SubjectService } from './subject/subject.service';
import { SubjectModule } from './subject/subject.module';
import { LessonModule } from './lesson/lesson.module';
import { AssessmentModule } from './assessment/assessment.module';

let AdminJSPrisma;
(async () => {
  AdminJSPrisma = await import('@adminJs/prisma');
})();
@Module({
  imports: [
    import('@adminjs/nestjs').then(({ AdminModule }) =>
      AdminModule.createAdminAsync({
        useFactory: () => ({
          adminJsOptions: {
            rootPath: '/admin',
            resources: [],
          },
        }),
      }),
    ),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    PrismaModule,
    AuthModule,
    PersonalInfoModule,
    RedisModule,
    SchoolModule,
    CourseModule,
    CollegeStudentModule,
    SubjectModule,
    LessonModule,
    AssessmentModule,
  ],
  controllers: [AppController],
  providers: [AppService, CourseService, SubjectService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
