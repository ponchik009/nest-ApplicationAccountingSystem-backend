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
import JwtAuthenticationGuard from 'src/auth/guard/jwt.guard';
import { WorkgroupsGuard } from 'src/auth/guard/workgroups.guard';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';
import { Workgroups } from 'src/auth/workgroups.decorator';
import { WORKGROUP_1S, WORKGROUP_SISADMIN } from 'src/consts/workgroups.names';
import { CreateWorkgroup } from './dto/createWorkgroup.dto';
import { WorkgroupService } from './workgroup.service';

@Controller('workgroup')
export class WorkgroupController {
  constructor(private workgroupService: WorkgroupService) {}

  @UseGuards(WorkgroupsGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Workgroups(WORKGROUP_SISADMIN)
  @Post()
  public create(@Body() dto: CreateWorkgroup) {
    return this.workgroupService.create(dto);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  public getAll() {
    return this.workgroupService.getAll();
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':id')
  @Workgroups(WORKGROUP_SISADMIN, WORKGROUP_1S)
  public getUsers(@Param('id') id: number, @Req() request: RequestWithUser) {
    return this.workgroupService.getUsers(id, request.user);
  }
}
