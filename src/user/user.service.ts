import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkgroupService } from 'src/workgroup/workgroup.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUserDto.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private workgroupService: WorkgroupService,
  ) {}

  public async getById(id: number): Promise<User> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .select(['user', 'workgroup'])
      .where('user.id = :id', { id })
      .leftJoin('user.workgroup', 'workgroup')
      .leftJoinAndSelect('workgroup.role', 'role')
      .getOne();

    if (!user) {
      throw new HttpException('Пользователь не найден!', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  public async getByLogin(login: string): Promise<User> {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.password',
        'user.login',
        'user.telegram',
        'workgroup',
      ])
      .where('user.login = :login', { login })
      .leftJoin('user.workgroup', 'workgroup')
      .leftJoinAndSelect('workgroup.role', 'role')
      .getOne();

    if (!user) {
      throw new HttpException('Пользователь не найден!', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  public async create(dto: CreateUserDto) {
    const workgroup = await this.workgroupService.getById(dto.workgroup.id);
    workgroup.users = undefined;
    try {
      const user = this.userRepo.create({ ...dto, workgroup });
      return await this.userRepo.save(user);
    } catch (err) {
      throw new HttpException(
        'Пользователь с такими данными уже существует!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
