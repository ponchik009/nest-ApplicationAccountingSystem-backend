import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateWorkgroup } from './dto/createWorkgroup.dto';
import { Workgroup } from './workgroup.entity';

@Injectable()
export class WorkgroupService {
  constructor(
    @InjectRepository(Workgroup) private workgroupRepo: Repository<Workgroup>,
  ) {}

  public async getById(id: number) {
    const workgroup = await this.workgroupRepo.findOne(id, {
      relations: ['users'],
    });

    if (workgroup) return workgroup;

    throw new HttpException(
      'Рабочей группы не существует!',
      HttpStatus.NOT_FOUND,
    );
  }

  public async getAll() {
    return await this.workgroupRepo.find();
  }

  public async create(dto: CreateWorkgroup) {
    try {
      const workgroup = this.workgroupRepo.create(dto);

      return await this.workgroupRepo.save(workgroup);
    } catch (err) {
      throw new HttpException(
        'Такая рабочая группа уже существует!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async getUsers(id: number, user: User) {
    const workgroup = await this.getById(id);

    if (user.workgroup.id !== workgroup.id) {
      throw new HttpException(
        'Нельзя получить пользователей не своей рабочей группы!',
        HttpStatus.FORBIDDEN,
      );
    }

    return workgroup;
  }
}
