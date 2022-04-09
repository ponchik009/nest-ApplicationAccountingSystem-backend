import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/auth/guard/jwt.guard';
import { WorkgroupsGuard } from 'src/auth/guard/workgroups.guard';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';
import { Workgroups } from 'src/auth/workgroups.decorator';
import { WORKGROUP_1S, WORKGROUP_SISADMIN } from 'src/consts/workgroups.names';
import { GetUserDto } from 'src/user/dto/getUserDto.dto';
import { User } from 'src/user/entities/user.entity';
import { CreateWorkgroup } from './dto/createWorkgroup.dto';
import { GetWorkgroupWithUsers } from './dto/getWorkgroupWithUsers.dto';
import { Workgroup } from './workgroup.entity';
import { WorkgroupService } from './workgroup.service';

@ApiTags('Рабочие группы')
@Controller('workgroup')
export class WorkgroupController {
  constructor(private workgroupService: WorkgroupService) {}

  @UseGuards(WorkgroupsGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Workgroups(WORKGROUP_SISADMIN)
  @Post()
  @ApiResponse({ status: 201, type: Workgroup })
  @ApiBody({ type: CreateWorkgroup })
  @ApiOperation({ summary: 'Создание рабочей группы' })
  public create(@Body() dto: CreateWorkgroup) {
    return this.workgroupService.create(dto);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  @ApiOperation({ summary: 'Получить все рабочие группы' })
  @ApiResponse({ status: 200, type: [Workgroup] })
  public getAll() {
    return this.workgroupService.getAll();
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':id/getUsers')
  @Workgroups(WORKGROUP_SISADMIN, WORKGROUP_1S)
  @ApiResponse({ status: 200, type: GetWorkgroupWithUsers })
  @ApiOperation({ summary: 'Получить пользователей рабочей группы' })
  public getUsers(@Param('id') id: number, @Req() request: RequestWithUser) {
    return this.workgroupService.getUsers(id, request.user);
  }
}
