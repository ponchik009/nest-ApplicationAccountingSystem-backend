import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/auth/guard/jwt.guard';
import { WorkgroupsGuard } from 'src/auth/guard/workgroups.guard';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';
import { Workgroups } from 'src/auth/workgroups.decorator';
import { ADMIN, SPECIALIST } from 'src/consts/workgroups.names';
import { CreateMessage } from 'src/message/dto/createMessage.dto';
import { AddMessage } from './dto/addMessage.dto';
import { AppointRequest } from './dto/appointRequest.dto';
import { CreateRequest } from './dto/createRequest.dto';
import { CreateStage } from './dto/createStage.dto';
import { GetRequestWithStage } from './dto/getRequestWithStage.dto';
import { GetRequestWithWorks } from './dto/getRequestWithWorks.dto';
import { GetWorkWithRequestStage } from './dto/getWorkWithRequestStage.dto';
import { RecruitRequest } from './dto/recruitRequest.dto';
import { RedirectRequest } from './dto/redirectRequest.dto';
import { Request } from './entities/request.entity';
import { RequestHistory } from './entities/requestHistory.entity';
import { RequestStage } from './entities/requestStage.entity';
import { RequestWork } from './entities/requestWorks.entity';
import { RequestService } from './request.service';

@ApiTags('Заявки')
@Controller('request')
export class RequestController {
  constructor(private requestService: RequestService) {}

  @ApiOperation({ summary: 'Создание стадии' })
  @ApiResponse({ status: 201, type: RequestStage })
  @ApiBody({ type: CreateStage })
  @UseGuards(WorkgroupsGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Workgroups(ADMIN)
  @Post('/stage')
  public createStage(@Body() dto: CreateStage) {
    return this.requestService.createStage(dto);
  }

  @ApiOperation({ summary: 'Создание заявки' })
  @ApiResponse({ status: 201, type: Request })
  @ApiBody({ type: CreateRequest })
  @UseGuards(JwtAuthenticationGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'image',
        maxCount: 10,
      },
    ]),
  )
  public createRequest(
    @Body() dto: CreateRequest,
    @Req() request: RequestWithUser,
    @UploadedFiles() files,
  ) {
    console.log(files);

    return this.requestService.createRequest(dto, request.user, files);
  }

  @ApiOperation({
    summary: 'Получение работ по заявкам для данной рабочей группы',
  })
  @ApiResponse({ status: 200, type: [RequestWork] })
  @UseGuards(WorkgroupsGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Workgroups(ADMIN, SPECIALIST)
  @Get('/exchange')
  public getExchange(@Req() request: RequestWithUser) {
    return this.requestService.getExchange(request.user);
  }

  @ApiOperation({
    summary: 'Получение созданных пользователем заявок',
  })
  @ApiResponse({ status: 200, type: [GetRequestWithStage] })
  @UseGuards(JwtAuthenticationGuard)
  @Get('/my')
  public getMy(@Req() request: RequestWithUser) {
    return this.requestService.getMy(request.user);
  }

  @ApiOperation({
    summary: 'Получение работ по заявкам, закрепленных за данным специалистом',
  })
  @ApiResponse({ status: 200, type: [GetWorkWithRequestStage] })
  @UseGuards(WorkgroupsGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Workgroups(ADMIN, SPECIALIST)
  @Get('/myWork')
  public getMyWork(@Req() request: RequestWithUser) {
    return this.requestService.getMyWork(request.user);
  }

  @ApiOperation({
    summary: 'Получение информации о конкретной заявке',
  })
  @ApiResponse({ status: 200, type: GetRequestWithWorks })
  @UseGuards(JwtAuthenticationGuard)
  @Get('/:id')
  public get(@Param('id') id: number) {
    return this.requestService.getById(id);
  }

  @ApiOperation({
    summary: 'Получение истории заявки',
  })
  @ApiResponse({ status: 200, type: [RequestHistory] })
  @UseGuards(JwtAuthenticationGuard)
  @Get('/:id/history')
  public getHistory(@Param('id') id: number) {
    return this.requestService.getHistory(id);
  }

  @ApiOperation({
    summary: 'Назначение заявки кому-то из своего отдела (в т.ч. себе)',
  })
  @ApiResponse({ status: 200, type: GetRequestWithWorks })
  @UseGuards(WorkgroupsGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Workgroups(ADMIN, SPECIALIST)
  @Patch(':id/appoint')
  public appoint(
    @Param('id') id: number,
    @Req() request: RequestWithUser,
    @Body() dto: AppointRequest,
  ) {
    return this.requestService.appoint(id, dto, request.user);
  }

  @ApiOperation({
    summary: 'Выполнение заявки',
  })
  @ApiResponse({ status: 200, type: GetRequestWithWorks })
  @UseGuards(WorkgroupsGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Workgroups(ADMIN, SPECIALIST)
  @Patch(':id/perform')
  public perform(@Param('id') id: number, @Req() request: RequestWithUser) {
    return this.requestService.perform(id, request.user);
  }

  @ApiOperation({
    summary: 'Отказ от заявки',
  })
  @ApiResponse({ status: 200, type: GetRequestWithWorks })
  @UseGuards(WorkgroupsGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Workgroups(ADMIN, SPECIALIST)
  @Patch(':id/refuse')
  public refuse(@Param('id') id: number, @Req() request: RequestWithUser) {
    return this.requestService.refuse(id, request.user);
  }

  @ApiOperation({
    summary: 'Перевод работы по заявке в другую рабочую группу',
  })
  @ApiResponse({ status: 200, type: GetWorkWithRequestStage })
  @UseGuards(WorkgroupsGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Workgroups(ADMIN, SPECIALIST)
  @Patch('redirect')
  public redirect(
    @Body() dto: RedirectRequest,
    @Req() request: RequestWithUser,
  ) {
    return this.requestService.redirect(dto, request.user);
  }

  @ApiOperation({
    summary: 'Объявление донабора по заявке',
  })
  @ApiResponse({ status: 200, type: GetRequestWithWorks })
  @ApiBody({ type: [RecruitRequest] })
  @UseGuards(WorkgroupsGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Workgroups(ADMIN, SPECIALIST)
  @Patch(':id/recruit')
  public recruit(
    @Param('id') id: number,
    @Body() dto: RecruitRequest[],
    @Req() request: RequestWithUser,
  ) {
    return this.requestService.recruit(id, request.user, dto);
  }

  @ApiOperation({
    summary: 'Закрытие заявки пользователем',
  })
  @ApiResponse({ status: 200, type: GetRequestWithWorks })
  @UseGuards(JwtAuthenticationGuard)
  @Patch(':id/approve')
  public approve(@Param('id') id: number, @Req() request: RequestWithUser) {
    return this.requestService.approve(id, request.user);
  }

  @ApiOperation({
    summary: 'Откат заявки пользователем',
  })
  @ApiResponse({ status: 200, type: GetRequestWithWorks })
  @UseGuards(JwtAuthenticationGuard)
  @Patch(':id/rollback')
  public rollBack(@Param('id') id: number, @Req() request: RequestWithUser) {
    return this.requestService.rollBack(id, request.user);
  }

  @ApiOperation({
    summary: 'Добавить сообщение в чат по заявке',
  })
  @ApiResponse({ status: 200, type: GetRequestWithWorks })
  @UseGuards(JwtAuthenticationGuard)
  @Post(':id/addMessage')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'image',
        maxCount: 10,
      },
    ]),
  )
  public addMessage(
    @Body() dto: AddMessage,
    @UploadedFiles() files,
    @Req() request: RequestWithUser,
    @Param('id') id: number,
  ) {
    console.log(files.image);

    return this.requestService.addMessage(id, request.user, dto, files);
  }
}
