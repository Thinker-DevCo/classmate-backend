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
    import('@adminjs/nestjs').then(({ AdminModule }) =>
      import('@adminjs/prisma').then((AdminJSPrisma) =>
        AdminModule.createAdminAsync({
          useFactory: async () => {
            // Note: Feel free to contribute to this documentation if you find a Nest-way of
            // injecting PrismaService into AdminJS module
            const prisma = new PrismaService();

            // `_baseDmmf` contains necessary Model metadata but it is a private method
            // so it isn't included in PrismaClient type

            return {
              adminJsOptions: {
                rootPath: '/admin',
                branding: {
                  companyName: 'Classmate',
                },
                resources: [
                  {
                    resource: {
                      model: AdminJSPrisma.getModelByName('User'),
                      client: prisma,
                    },

                    options: {},
                  },
                  {
                    resource: {
                      model: AdminJSPrisma.getModelByName('School'),
                      client: prisma,
                    },

                    options: {},
                  },
                  {
                    resource: {
                      model: AdminJSPrisma.getModelByName('Course'),
                      client: prisma,
                    },

                    options: {},
                  },
                  {
                    resource: {
                      model: AdminJSPrisma.getModelByName('Subject'),
                      client: prisma,
                    },

                    options: {},
                  },
                  {
                    resource: {
                      model: AdminJSPrisma.getModelByName('Assessment'),
                      client: prisma,
                    },

                    options: {},
                  },
                  {
                    resource: {
                      model: AdminJSPrisma.getModelByName('Lesson'),
                      client: prisma,
                    },

                    options: {},
                  },
                ],
              },
            };
          },
        }),
      ),
    ),
  ],
  controllers: [AppController],
  providers: [AppService, CourseService, SubjectService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(cookieParser()).forRoutes('*');
  }
}