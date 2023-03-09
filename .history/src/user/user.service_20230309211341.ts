import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    const users = this.prisma.user.findMany();

    if (!users)
      throw new NotFoundException('there are no users in the database!');
    (await users).forEach((user) => {
      delete user.hash_password;
      delete user.hashedRt;
    });
    return users;
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException('User was not found');
    delete (await user).hash_password;
    delete user.hashedRt;
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) throw new NotFoundException('User was not found');
    delete (await user).hash_password;
    delete user.hashedRt;
    return user;
  }

  async updateUserById(userId: string, dto: UpdateUserDto) {
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
      throw new NotFoundException('User could not be update');
    }
  }
}
