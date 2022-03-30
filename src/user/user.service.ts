import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUserDto.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  public async getById(id: number) {
    return await this.userRepo.findOne(id);
  }

  public async getByEmail(email: string) {
    return await this.userRepo
      .createQueryBuilder('User')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.password',
        'user.login',
      ])
      .where('user.email = :email', { email })
      .getOne();
  }

  public async create(dto: CreateUserDto) {
    const user = this.userRepo.create(dto);
    return await this.userRepo.save(user);
  }
}
