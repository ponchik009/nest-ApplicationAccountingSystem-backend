import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workgroup } from './workgroup.entity';

@Injectable()
export class WorkgroupService {
  constructor(
    @InjectRepository(Workgroup) private workgroupRepo: Repository<Workgroup>,
  ) {}

  public async getById(id: number) {
    const workgroup = await this.workgroupRepo.findOne(id);

    if (workgroup) return workgroup;

    throw new HttpException(
      'Рабочей группы не существует!',
      HttpStatus.NOT_FOUND,
    );
  }
}
