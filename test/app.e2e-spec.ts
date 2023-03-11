import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { SignInDto, SignUpDto } from '../src/auth/dto';
import { UserDto } from '../src/user/dto/user.dto';
import { UpdateUserDto } from '../src/user/dto/update-user.dto';
import { PrismaService } from '../src/prisma/prisma.service';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // excludes elements that are not defined in DTO
      }),
    );
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    await prisma.cleanDB();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('Signup', () => {
      const dto: SignUpDto = {
        username: 'testUser',
        email: 'test@gmail.com',
        password: '1234',
      };

      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('should throw if empty', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
          .stores('token', 'access_token');
      });
    });

    describe('Signin', () => {
      const dto: SignInDto = {
        email: 'test@gmail.com',
        password: '1234',
      };

      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('should throw if empty', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });

      it('should not signin(invalid email)', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: 'fail@gmail.com',
            password: '1234',
          })
          .expectStatus(404);
      });

      it('should not signin(invalid pass)', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: 'test@gmail.com',
            password: 'failPass',
          })
          .expectStatus(403);
      });

      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('access_token', 'access_token')
          .stores('refresh_token', 'refresh_token');
      });
    });
    describe('logout', () => {
      it('should logout', () => {
        return pactum
          .spec()
          .withHeaders({ Authorization: 'Bearer $S{access_token}' })
          .post('/auth/logout')
          .expectStatus(200);
      });

      it('should  not logout', () => {
        return pactum.spec().post('/auth/logout').expectStatus(401);
      });
    });

    // describe('refresh', () => {
    //   it('should refresh token', () => {
    //     return pactum
    //       .spec()
    //       .post('/auth/refresh')
    //       .expectStatus(200)
    //       .withHeaders({ Authorization: 'Bearer $S{refresh_token}' })
    //       .inspect();
    //   });
    // });
  });


  it.todo('should pass');
});
