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
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/auth/guard/jwt.guard';
import { WorkgroupsGuard } from 'src/auth/guard/workgroups.guard';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';
import { Workgroups } from 'src/auth/workgroups.decorator';
import { WORKGROUP_1S, WORKGROUP_SISADMIN } from 'src/consts/workgroups.names';
import { CreateMessage } from 'src/message/dto/createMessage.dto';
import { AddMessage } from './dto/addMessage.dto';
import { AppointRequest } from './dto/appointRequest.dto';
import { CreateRequest } from './dto/createRequest.dto';
import { CreateStage } from './dto/createStage.dto';
import { RecruitRequest } from './dto/recruitRequest.dto';
import { RedirectRequest } from './dto/redirectRequest.dto';
import { Request } from './entities/request.entity';
import { RequestStage } from './entities/requestStage.entity';
import { RequestService } from './request.service';

@Controller('request')
export class RequestController {
  constructor(private requestService: RequestService) {}

  @ApiOperation({ summary: 'Создание стадии' })
  @ApiResponse({ status: 201, type: RequestStage })
  @ApiBody({ type: CreateStage })
  @UseGuards(WorkgroupsGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Workgroups(WORKGROUP_SISADMIN)
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
    return this.requestService.createRequest(dto, request.user, files);
  }

  @UseGuards(WorkgroupsGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Workgroups(WORKGROUP_SISADMIN, WORKGROUP_1S)
  @Get('/exchange')
  public getExchange(@Req() request: RequestWithUser) {
    return this.requestService.getExchange(request.user);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('/my')
  public getMy(@Req() request: RequestWithUser) {
    return this.requestService.getMy(request.user);
  }

  @UseGuards(WorkgroupsGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Workgroups(WORKGROUP_SISADMIN, WORKGROUP_1S)
  @Get('/myWork')
  public getMyWork(@Req() request: RequestWithUser) {
    return this.requestService.getMyWork(request.user);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('/:id')
  public get(@Param('id') id: number) {
    return this.requestService.getById(id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('/:id/history')
  public getHistory(@Param('id') id: number) {
    return this.requestService.getHistory(id);
  }

  @UseGuards(WorkgroupsGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Workgroups(WORKGROUP_SISADMIN, WORKGROUP_1S)
  @Patch(':id/appoint')
  public appoint(
    @Param('id') id: number,
    @Req() request: RequestWithUser,
    @Body() dto: AppointRequest,
  ) {
    return this.requestService.appoint(id, dto, request.user);
  }

  @UseGuards(WorkgroupsGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Workgroups(WORKGROUP_SISADMIN, WORKGROUP_1S)
  @Patch(':id/perform')
  public perform(@Param('id') id: number, @Req() request: RequestWithUser) {
    return this.requestService.perform(id, request.user);
  }

  @UseGuards(WorkgroupsGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Workgroups(WORKGROUP_SISADMIN, WORKGROUP_1S)
  @Patch(':id/refuse')
  public refuse(@Param('id') id: number, @Req() request: RequestWithUser) {
    return this.requestService.refuse(id, request.user);
  }

  @UseGuards(WorkgroupsGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Workgroups(WORKGROUP_SISADMIN, WORKGROUP_1S)
  @Patch('redirect')
  public redirect(
    @Body() dto: RedirectRequest,
    @Req() request: RequestWithUser,
  ) {
    return this.requestService.redirect(dto, request.user);
  }

  @UseGuards(WorkgroupsGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Workgroups(WORKGROUP_SISADMIN, WORKGROUP_1S)
  @Patch(':id/recruit')
  public recruit(
    @Param('id') id: number,
    @Body() dto: RecruitRequest[],
    @Req() request: RequestWithUser,
  ) {
    return this.requestService.recruit(id, request.user, dto);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch(':id/approve')
  public approve(@Param('id') id: number, @Req() request: RequestWithUser) {
    return this.requestService.approve(id, request.user);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch(':id/rollback')
  public rollBack(@Param('id') id: number, @Req() request: RequestWithUser) {
    return this.requestService.rollBack(id, request.user);
  }

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
    @Param('id') id: number,
    @Req() request: RequestWithUser,
    @Body() dto: AddMessage,
    @UploadedFiles() files,
  ) {
    return this.requestService.addMessage(id, request.user, dto, files);
  }
}
