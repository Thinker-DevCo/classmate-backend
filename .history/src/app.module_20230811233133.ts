import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PersonalInfoModule } from './personal-info/personal-info.module';

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

import { Database, Resource } from '@adminjs/prisma';
import AdminJS from 'adminjs';
import { AdminModule } from '@adminjs/nestjs';
AdminJS.registerAdapter({ Resource, Database });

// import('adminjs').then((AdminJs) => {
//   import('@adminjs/prisma').then((AdminJSPrisma) => {
//     AdminJs.AdminJS.registerAdapter({
//       Resource: AdminJSPrisma.Resource,
//       Database: AdminJSPrisma.Database,
//     });
//   });
// });

@Module({
  imports: [
    AdminModule.createAdminAsync({
      imports: [PrismaModule],
      inject: [PrismaService],
      useFactory: async (prisma: PrismaService) => {
        const dmmf = (prisma as any)._dmmf as DMMFClass;

        return {
          adminJsOptions: {
            rootPath: '/admin',
            resources: [
              {
                resource: { model: dmmf.modelMap, client: prisma },
                options: {},
              },
            ],
          },
        };
      },
    }),
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
