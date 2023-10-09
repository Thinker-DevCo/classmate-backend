import { Injectable } from '@nestjs/common';
import { CreateUserFavoriteDocementDto } from './dto/create-user-favorite-docement.dto';
import { UpdateUserFavoriteDocementDto } from './dto/update-user-favorite-docement.dto';

@Injectable()
export class UserFavoriteDocementsService {
  create(createUserFavoriteDocementDto: CreateUserFavoriteDocementDto) {
    return 'This action adds a new userFavoriteDocement';
  }

  findAll() {
    return `This action returns all userFavoriteDocements`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userFavoriteDocement`;
  }

  update(id: number, updateUserFavoriteDocementDto: UpdateUserFavoriteDocementDto) {
    return `This action updates a #${id} userFavoriteDocement`;
  }

  remove(id: number) {
    return `This action removes a #${id} userFavoriteDocement`;
  }
}
