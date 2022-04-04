import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWorkgroup } from './dto/createWorkgroup.dto';
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

  public async getAll() {
    return await this.workgroupRepo.find();
  }

  public async create(dto: CreateWorkgroup) {
    let workgroup = this.workgroupRepo.create(dto);
    workgroup = await this.workgroupRepo.save(workgroup);

    return workgroup;
  }
}
