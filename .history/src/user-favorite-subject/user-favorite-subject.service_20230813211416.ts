import { Injectable } from '@nestjs/common';
import { CreateUserFavoriteSubjectDto } from './dto/create-user-favorite-subject.dto';
import { UpdateUserFavoriteSubjectDto } from './dto/update-user-favorite-subject.dto';

@Injectable()
export class UserFavoriteSubjectService {
  create(createUserFavoriteSubjectDto: CreateUserFavoriteSubjectDto) {
    return 'This action adds a new userFavoriteSubject';
  }

  findAll() {
    return `This action returns all userFavoriteSubject`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userFavoriteSubject`;
  }

  update(id: number, updateUserFavoriteSubjectDto: UpdateUserFavoriteSubjectDto) {
    return `This action updates a #${id} userFavoriteSubject`;
  }

  remove(id: number) {
    return `This action removes a #${id} userFavoriteSubject`;
  }
}
