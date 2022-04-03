import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReasonsService } from 'src/reasons/reasons.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateRequest } from './dto/createRequest.dto';
import { CreateStage } from './dto/createStage.dto';
import { Request } from './entities/request.entity';
import { RequestHistory } from './entities/requestHistory.entity';
import { RequestStage } from './entities/requestStage.entity';
import { RequestWork } from './entities/requestWorks.entity';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request) private requestRepo: Repository<Request>,
    @InjectRepository(RequestStage)
    private requestStageRepo: Repository<RequestStage>,
    @InjectRepository(RequestHistory)
    private requestHistoryRepo: Repository<RequestHistory>,
    @InjectRepository(RequestWork)
    private requestWorkRepo: Repository<RequestWork>,
    private reasonsService: ReasonsService,
  ) {}

  public async createStage(dto: CreateStage) {
    const stage = this.requestStageRepo.create(dto);

    try {
      await this.requestStageRepo.save(stage);
      return stage;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async createRequest(dto: CreateRequest, user: User) {
    const request = this.requestRepo.create(dto);
    request.date = new Date(Date.now());
    try {
      request.stage = await this.requestStageRepo.findOne({
        name: 'В ожидании',
      });
      request.user = user;
      const reason = await this.reasonsService.getReasonById(dto.reason.id);
      request.specific_name = reason.name;

      const createdRequest = await this.requestRepo.save(request);

      // запись в requestHistory
      const history = this.requestHistoryRepo.create({
        request: createdRequest,
        stage: request.stage,
        info: 'Создание заявки',
        date: new Date(Date.now()),
      });
      await this.requestHistoryRepo.save(history);

      // добавление в requestWork
      const requestWork = this.requestWorkRepo.create({
        user: null,
        workgroup: reason.defaultWorkgroup,
        request: createdRequest,
        dateOfEnd: null,
      });
      await this.requestWorkRepo.save(requestWork);

      return createdRequest;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public async getExchange(user: User) {
    return await this.requestWorkRepo.find({
      where: { workgroup: { id: user.workgroup.id }, user: null },
      relations: ['request'],
    });
  }

  public async getMy(user: User) {
    return await this.requestRepo.find({
      where: { user: { id: user.id } },
      relations: ['stage'],
    });
  }

  public async getMyWork(user: User) {
    return await this.requestRepo
      .createQueryBuilder('request')
      .leftJoin('request.works', 'requestWork')
      .where('requestWork.userId = :id', { id: user.id })
      .getMany();
  }

  public async getById(id: number) {
    const request = await this.requestRepo.findOne(id);

    if (!request) {
      throw new HttpException('Заявка не найдена!', HttpStatus.NOT_FOUND);
    }

    // if (request.user.id !== user.id && !request.works.some(work => work.user.id === user.id)) {
    //   throw new HttpException("")
    // }

    return request;
  }

  public async getHistory(id: number) {
    const history = await this.requestHistoryRepo.find({
      where: { request: { id: id } },
      relations: ['stage'],
    });

    if (!history) {
      throw new HttpException('История не найдена', HttpStatus.NOT_FOUND);
    }

    return history;
  }
}
