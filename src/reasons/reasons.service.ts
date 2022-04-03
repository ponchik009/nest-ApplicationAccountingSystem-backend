import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGlobalReasonDto } from './dto/createGlobalReason.dto';
import { CreateProgram } from './dto/createProgram.dto';
import { CreateRequestReason } from './dto/createRequestReason.dto';
import { GlobalReason } from './entities/globalReason.entity';
import { Program } from './entities/program.entity';
import { RequestReason } from './entities/requestReason.entity';

@Injectable()
export class ReasonsService {
  constructor(
    @InjectRepository(GlobalReason)
    private globalReasonRepo: Repository<GlobalReason>,
    @InjectRepository(RequestReason)
    private requestReasonRepo: Repository<RequestReason>,
    @InjectRepository(Program)
    private programRepo: Repository<Program>,
  ) {}

  public async createGlobalReason(dto: CreateGlobalReasonDto) {
    try {
      const globalReason = this.globalReasonRepo.create(dto);
      await this.globalReasonRepo.save(globalReason);
      return globalReason;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Глобальная причина с таким именем уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async createRequestReason(dto: CreateRequestReason) {
    try {
      const requestReason = this.requestReasonRepo.create(dto);
      await this.requestReasonRepo.save(requestReason);
      return requestReason;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Причина с таким именем уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async createProgram(dto: CreateProgram) {
    try {
      const program = this.programRepo.create(dto);
      await this.programRepo.save(program);
      return program;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Программа с таким именем уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async get() {
    const globalReasons = await this.globalReasonRepo.find({
      relations: ['requestReasons'],
    });
    const programs = await this.programRepo.find();

    return {
      globalReasons,
      programs,
    };
  }

  public async getReasonById(id: number) {
    return await this.requestReasonRepo.findOne(id, {
      relations: ['defaultWorkgroup'],
    });
  }
}
