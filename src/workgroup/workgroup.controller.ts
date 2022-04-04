import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/guard/jwt.guard';
import { WorkgroupsGuard } from 'src/auth/guard/workgroups.guard';
import { Workgroups } from 'src/auth/workgroups.decorator';
import { WORKGROUP_SISADMIN } from 'src/consts/workgroups.names';
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
}
