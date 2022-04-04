import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReasonsService } from 'src/reasons/reasons.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { AppointRequest } from './dto/appointRequest.dto';
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
    private userService: UserService,
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
      order: { stage: 'DESC' },
      relations: ['stage'],
    });
  }

  public async getMyWork(user: User) {
    return await this.requestWorkRepo
      .createQueryBuilder('requestWork')
      .leftJoinAndSelect('requestWork.request', 'request')
      .leftJoinAndSelect('request.stage', 'requestStage')
      .where('requestWork.userId = :id', { id: user.id })
      .getMany();
  }

  public async getById(id: number) {
    // const request = await this.requestRepo.findOne(id, {
    //   relations: ['stage', 'user', 'works'],
    // });

    const request = await this.requestRepo
      .createQueryBuilder('request')
      .select(['request'])
      .leftJoinAndSelect('request.user', 'client')
      .leftJoinAndSelect('request.stage', 'stage')
      .leftJoinAndSelect('request.works', 'works')
      .leftJoinAndSelect('works.user', 'perfromer')
      .where('request.id = :id', { id })
      .getOne();

    if (!request) {
      throw new HttpException('Заявка не найдена!', HttpStatus.NOT_FOUND);
    }

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

  public async appoint(id: number, dto: AppointRequest, appointer: User) {
    const request = await this.getById(id);
    const works = await this.requestWorkRepo.find({
      where: {
        request: { id },
        user: null,
        workgroup: { id: appointer.workgroup.id },
      },
    });
    const user = await this.userService.getById(dto.user.id);

    if (!works.length) {
      throw new HttpException(
        'Работ по заявке не найдено',
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.workgroup.id !== appointer.workgroup.id) {
      throw new HttpException(
        'Нельзя назначить заявку пользователю из другого отдела',
        HttpStatus.FORBIDDEN,
      );
    }

    works[0].user = user;
    const work = await this.requestWorkRepo.save(works[0]);
    const newStage = await this.requestStageRepo.findOne({
      name: 'В процессе',
    });

    // сохраняем обновленный статус заявки
    request.stage = newStage;
    await this.requestRepo.save(request);

    // отображаем изменение в истории заявки
    const newHistory = this.requestHistoryRepo.create({
      info: 'Заявка принята в обработку специалистом ' + user.name,
      date: new Date(Date.now()),
      stage: newStage,
      request,
    });
    await this.requestHistoryRepo.save(newHistory);

    request.works.forEach((work) => {
      if (work.id === works[0].id) {
        work.user = works[0].user;
      }
    });

    return request;
  }

  public async perform(id: number, performer: User) {
    const request = await this.getById(id);

    const works = await this.getWorks(id, performer);

    let newStage = request.stage;
    if (request.works.filter((work) => work.dateOfEnd === null).length === 1)
      newStage = await this.requestStageRepo.findOne({
        name: 'В завершении',
      });

    // меняем статус заявки
    request.stage = newStage;
    await this.requestRepo.save(request);

    // сохраняем в историю
    const newHistory = this.requestHistoryRepo.create({
      info: 'Заявка завершена исполнителем ' + performer.name,
      date: new Date(Date.now()),
      stage: newStage,
      request,
    });
    await this.requestHistoryRepo.save(newHistory);

    // помечаем дату окончания работы
    works[0].dateOfEnd = new Date(Date.now());
    await this.requestWorkRepo.save(works[0]);

    request.works.forEach((work) => {
      if (work.id === works[0].id) {
        work.dateOfEnd = works[0].dateOfEnd;
      }
    });

    return request;
  }

  public async approve(id: number, client: User) {
    const request = await this.getById(id);

    if (request.user.id !== client.id) {
      throw new HttpException(
        'Заявка не принадлежит пользователю!',
        HttpStatus.FORBIDDEN,
      );
    }

    // меняем статус заявки
    const newStage = await this.requestStageRepo.findOne({
      name: 'Закрыта',
    });
    request.stage = newStage;
    await this.requestRepo.save(request);

    // сохраняем в историю
    const newHistory = this.requestHistoryRepo.create({
      info: 'Заявка закрыта пользователем',
      date: new Date(Date.now()),
      stage: newStage,
      request,
    });
    await this.requestHistoryRepo.save(newHistory);
  }

  public async rollBack(id: number, client: User) {}

  public async refuse(id: number, performer: User) {
    const request = await this.getById(id);
    const works = await this.getWorks(id, performer);

    let newStage = request.stage;
    if (request.works.filter((work) => work.dateOfEnd !== null).length === 0)
      newStage = await this.requestStageRepo.findOne({
        name: 'В ожидании',
      });
    // меняем статус заявки
    request.stage = newStage;
    await this.requestRepo.save(request);

    // сохраняем в историю
    const newHistory = this.requestHistoryRepo.create({
      info: 'Заявка отклонена исполнителем ' + performer.name,
      date: new Date(Date.now()),
      stage: newStage,
      request,
    });
    await this.requestHistoryRepo.save(newHistory);

    // помечаем дату окончания работы
    works[0].user = null;
    await this.requestWorkRepo.save(works[0]);

    request.works = request.works.filter((work) => work.id !== works[0].id);

    return request;
  }

  public async redirect(id: number) {}

  public async recruit(id: number) {}

  private async getWorks(requestId: number, performer: User) {
    const works = await this.requestWorkRepo.find({
      where: {
        request: { id: requestId },
        user: { id: performer.id },
        dateOfEnd: null,
      },
    });

    if (!works.length) {
      throw new HttpException('Нет работ по заявке', HttpStatus.NOT_FOUND);
    }

    return works;
  }
}
