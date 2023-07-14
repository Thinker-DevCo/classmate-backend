import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { RedisService } from 'src/redis/redis.service';

//crud for user account information
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  //returns and array of object users
  async getAllUsers() {
    const cachedUsers = await this.redis.get('users');

    if (cachedUsers) return JSON.parse(cachedUsers);
    const users = this.prisma.user.findMany();

    if (!users)
      throw new NotFoundException('there are no users in the database!');
    (await users).forEach((user) => {
      delete user.hash_password;
      delete user.hashedRt;
    });
    await this.redis.set('users', JSON.stringify(users), 'EX', 15);
    return users;
  }

  //finds a user using the unique field id then returns it
  async getUserById(userId: string) {
    const cachedUser = await this.redis.get('user');
    if (cachedUser) return JSON.parse(cachedUser);
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException('User was not found');
    delete (await user).hash_password;
    delete user.hashedRt;
    await this.redis.set('user', JSON.stringify(user), 'EX', 15);
    return user;
  }

  //finds the user using email then returns it
  async getUserByEmail(email: string) {
    const cachedUser = await this.redis.get('user');
    if (cachedUser) return JSON.parse(cachedUser);
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) throw new NotFoundException('User was not found');
    delete (await user).hash_password;
    delete user.hashedRt;
    await this.redis.set('user', JSON.stringify(user), 'EX', 15);
    return user;
  }

  //updates a specific user  and returns a success message
  async updateUser(userId: string, dto: UpdateUserDto) {
    try {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...dto,
        },
      });
      return { message: ' user successfully updated' };
    } catch (err) {
      console.log(err);
      throw new BadRequestException('User could not be update');
    }
  }

  async deleteUser(userId: string) {
    try {
      await this.prisma.user.delete({
        where: {
          id: userId,
        },
      });
      return { message: 'successfully deleted' };
    } catch (err) {
      console.log(err);
      throw new BadRequestException('User could not be deleted');
    }
  }
}
