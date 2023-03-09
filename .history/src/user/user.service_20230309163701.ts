import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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

  async getUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    delete (await user).hash_password, user.hashedRt;
    return user;
  }
}
