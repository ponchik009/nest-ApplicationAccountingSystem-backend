import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/auth/guard/jwt.guard';
import { JwtTelegramGuard } from 'src/auth/guard/jwtTelegram.guard';
import { WorkgroupsGuard } from 'src/auth/guard/workgroups.guard';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';
import { Workgroups } from 'src/auth/workgroups.decorator';
import { ADMIN, SPECIALIST } from 'src/consts/workgroups.names';

import { CreateWorkgroup } from './dto/createWorkgroup.dto';
import { GetWorkgroupWithUsers } from './dto/getWorkgroupWithUsers.dto';
import { Workgroup } from './entities/workgroup.entity';
import { WorkgroupService } from './workgroup.service';

@UseGuards(JwtTelegramGuard)
@ApiTags('Рабочие группы')
@Controller('workgroup')
export class WorkgroupController {
  constructor(private workgroupService: WorkgroupService) {}

  @UseGuards(WorkgroupsGuard)
  // @UseGuards(JwtAuthenticationGuard)
  @Workgroups(ADMIN)
  @Post()
  @ApiResponse({ status: 201, type: Workgroup })
  @ApiBody({ type: CreateWorkgroup })
  @ApiOperation({ summary: 'Создание рабочей группы' })
  public create(@Body() dto: CreateWorkgroup) {
    return this.workgroupService.create(dto);
  }

  // @UseGuards(JwtAuthenticationGuard)
  @Get()
  @ApiOperation({ summary: 'Получить все рабочие группы' })
  @ApiResponse({ status: 200, type: [Workgroup] })
  public getAll() {
    return this.workgroupService.getAll();
  }

  // @UseGuards(JwtAuthenticationGuard)
  @Get(':id/getUsers')
  @Workgroups(ADMIN, SPECIALIST)
  @ApiResponse({ status: 200, type: GetWorkgroupWithUsers })
  @ApiOperation({ summary: 'Получить пользователей рабочей группы' })
  public getUsers(@Param('id') id: number, @Req() request: RequestWithUser) {
    return this.workgroupService.getUsers(id, request.user);
  }
}
