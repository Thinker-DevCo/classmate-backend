import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { PrismaService } from './prisma/prisma.service';
import { DMMFClass } from '@prisma/client/runtime';
import { Prisma } from '@prisma/client';

import('adminjs').then((AdminJs) => {
  import('@adminjs/prisma').then((AdminJSPrisma) => {
    AdminJs.AdminJS.registerAdapter({
      Resource: AdminJSPrisma.Resource,
      Database: AdminJSPrisma.Database,
    });
  });
});

@Module({
  imports: [
    // import('@adminjs/nestjs').then(({ AdminModule }) =>
    //   AdminModule.createAdminAsync({
    //     useFactory: () => {
    //       // Note: Feel free to contribute to this documentation if you find a Nest-way of
    //       // injecting PrismaService into AdminJS module
    //       const prisma = new PrismaService();
    //       // `_baseDmmf` contains necessary Model metadata but it is a private method
    //       // so it isn't included in PrismaClient type
    //       const dmmf = (prisma as any)._baseDmmf as DMMFClass;
    //       return {
    //         adminJsOptions: {
    //           rootPath: '/admin',
    //           resources: [
    //             {
    //               resource: {
    //                 model: dmmf.modelMap.User,
    //                 client: prisma,
    //               },
    //               options: {},
    //             },
    //           ],
    //         },
    //       };
    //     },
    //   }),
    // ),
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
    // consumer.apply(cookieParser()).forRoutes('*');
  }
}
