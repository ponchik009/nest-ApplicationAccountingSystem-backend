import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageService } from 'src/message/message.service';
import { RequestReason } from 'src/reasons/entities/requestReason.entity';
import { ReasonsService } from 'src/reasons/reasons.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { WorkgroupService } from 'src/workgroup/workgroup.service';
import { Repository } from 'typeorm';
import { AddMessage } from './dto/addMessage.dto';
import { AppointRequest } from './dto/appointRequest.dto';
import { CreateRequest } from './dto/createRequest.dto';
import { CreateStage } from './dto/createStage.dto';
import { RecruitRequest } from './dto/recruitRequest.dto';
import { RedirectRequest } from './dto/redirectRequest.dto';
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
    private workgroupService: WorkgroupService,
    private messageService: MessageService,
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

  public async createRequest(dto: CreateRequest, user: User, files) {
    try {
      const reasonFromJson = JSON.parse(dto.reason) as RequestReason;
      const reason = await this.reasonsService.getReasonById(reasonFromJson.id);
      const request = this.requestRepo.create({ ...dto, reason, messages: [] });

      request.date = new Date(Date.now());
      request.stage = await this.requestStageRepo.findOne({
        name: 'В ожидании',
      });
      request.user = user;
      request.specific_name = reason.name;
      request.messages.push(
        await this.messageService.create(
          { user, text: dto.description },
          files,
        ),
      );

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
      .leftJoinAndSelect('requestWork.workgroup', 'workgroup')
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
      .leftJoinAndSelect('request.messages', 'messages')
      .leftJoinAndSelect('works.user', 'perfromer')
      .leftJoinAndSelect('works.workgroup', 'workWorkgroup')
      .leftJoinAndSelect('messages.files', 'files')
      .leftJoinAndSelect('messages.user', 'user')
      .leftJoinAndSelect('user.workgroup', 'workgroup')
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
    const alreadyWork = await this.requestWorkRepo.find({
      where: { request: { id }, user: { id: user.id } },
    });

    if (alreadyWork.length) {
      throw new HttpException(
        'Пользователь уже работает по этой заявке!',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.workgroup.id !== appointer.workgroup.id) {
      throw new HttpException(
        'Нельзя назначить заявку пользователю из другого отдела',
        HttpStatus.FORBIDDEN,
      );
    }

    if (!works.length) {
      throw new HttpException(
        'Работ по заявке не найдено',
        HttpStatus.NOT_FOUND,
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

    return request;
  }

  public async rollBack(id: number, client: User) {
    const request = await this.getById(id);

    if (request.user.id !== client.id) {
      throw new HttpException(
        'Не хватает доступа для отката заявки',
        HttpStatus.FORBIDDEN,
      );
    }

    if (request.stage.name !== 'В завершении') {
      throw new HttpException(
        'Заявка еще не завершена. Вы не можете ее откатить!',
        HttpStatus.BAD_REQUEST,
      );
    }

    request.works = request.works.sort(
      (work1, work2) => work2.dateOfEnd.getTime() - work1.dateOfEnd.getTime(),
    );
    request.works[0].dateOfEnd = null;

    const newStage = await this.requestStageRepo.findOne({
      name: 'В процессе',
    });
    request.stage = newStage;

    const newHistory = this.requestHistoryRepo.create({
      info: 'Заявка откачена пользователем ' + client.name,
      date: new Date(Date.now()),
      stage: newStage,
      request,
    });
    await this.requestHistoryRepo.save(newHistory);

    await this.requestRepo.save(request);

    await this.requestWorkRepo.save(request.works[0]);

    return request;
  }

  public async refuse(id: number, performer: User) {
    const request = await this.getById(id);
    const works = await this.getWorks(id, performer);

    let newStage = request.stage;
    if (request.works.filter((work) => work.user !== null).length === 0)
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

  public async redirect(dto: RedirectRequest, user: User) {
    const work = await this.requestWorkRepo
      .createQueryBuilder('requestWork')
      .leftJoinAndSelect('requestWork.request', 'request')
      .leftJoinAndSelect('requestWork.user', 'user')
      .leftJoinAndSelect('request.stage', 'stage')
      .leftJoinAndSelect('requestWork.workgroup', 'workgroup')
      .where('requestWork.id = :id', { id: dto.work.id })
      .getOne();

    if (!work) {
      throw new HttpException('Работа не найдена', HttpStatus.NOT_FOUND);
    }

    const workgroup = await this.workgroupService.getById(dto.workgroup.id);

    if (work.user !== null) {
      throw new HttpException(
        'Работа по заявке уже обрабатывается пользователем',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.workgroup.id !== work.workgroup.id) {
      throw new HttpException(
        'Нельзя перенаправить работу по заявке не из своего отдела!',
        HttpStatus.FORBIDDEN,
      );
    }

    // work.workgroup = workgroup;
    await this.requestWorkRepo.save(work);

    // сохраняем в историю
    const newHistory = this.requestHistoryRepo.create({
      info: 'Работа по заявке переведена в отдел  ' + workgroup.name,
      date: new Date(Date.now()),
      stage: work.request.stage,
      request: work.request,
    });
    await this.requestHistoryRepo.save(newHistory);

    return work;
  }

  public async recruit(id: number, performer: User, data: RecruitRequest[]) {
    const request = await this.getById(id);
    // console.log(request);

    if (
      request.stage.name === 'Закрыта' ||
      request.stage.name === 'В завершении'
    ) {
      throw new HttpException(
        'Заявка уже закрыта или находится в стадии завершения!',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      !request.works.some((work) => work.user && work.user.id === performer.id)
    ) {
      throw new HttpException(
        'Пользователь не работает по данной заявке!',
        HttpStatus.FORBIDDEN,
      );
    }

    const works = [];
    for (const recruit of data) {
      for (let i = 0; i < recruit.count; i++) {
        works.push(
          this.requestWorkRepo.create({
            user: null,
            workgroup: recruit.workgroup,
            request: { id: request.id },
            dateOfEnd: null,
          }),
        );
      }
    }

    try {
      request.works = request.works.concat(
        await this.requestWorkRepo.save(works),
      );
    } catch (err) {
      throw new HttpException(
        'Рабочей группы не существует',
        HttpStatus.NOT_FOUND,
      );
    }

    // сохраняем в историю
    const newHistory = this.requestHistoryRepo.create({
      info: 'Объявлен донабор по заявке',
      date: new Date(Date.now()),
      stage: request.stage,
      request: request,
    });
    await this.requestHistoryRepo.save(newHistory);

    return request;
  }

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

  public async addMessage(id: number, user: User, dto: AddMessage, files) {
    const request = await this.getById(id);

    if (
      user.id !== request.user.id &&
      !request.works.some((work) => work.user.id === user.id)
    ) {
      throw new HttpException(
        'Вы не можете добавлять сообщения по этой заявке',
        HttpStatus.FORBIDDEN,
      );
    }

    if (request.stage.name === 'В завершении') {
      throw new HttpException('Заявка уже закрыта!', HttpStatus.BAD_REQUEST);
    }

    const message = await this.messageService.create({ ...dto, user }, files);
    request.messages.push(message);

    return await this.requestRepo.save(request);
  }
}
