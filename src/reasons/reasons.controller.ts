import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/auth/guard/jwt.guard';
import { WorkgroupsGuard } from 'src/auth/guard/workgroups.guard';
import { Workgroups } from 'src/auth/workgroups.decorator';
import { WORKGROUP_SISADMIN } from 'src/consts/workgroups.names';
import { CreateGlobalReasonDto } from './dto/createGlobalReason.dto';
import { CreateProgram } from './dto/createProgram.dto';
import { CreateRequestReason } from './dto/createRequestReason.dto';
import { GetReasons } from './dto/getReasonsDto.dto';
import { GlobalReason } from './entities/globalReason.entity';
import { Program } from './entities/program.entity';
import { RequestReason } from './entities/requestReason.entity';
import { ReasonsService } from './reasons.service';

@Controller('reasons')
export class ReasonsController {
  constructor(private reasonsService: ReasonsService) {}

  @UseGuards(WorkgroupsGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Workgroups(WORKGROUP_SISADMIN)
  @ApiResponse({ status: 201, type: GlobalReason })
  @ApiBody({ type: CreateGlobalReasonDto })
  @Post('/global')
  public createGlobalReason(@Body() dto: CreateGlobalReasonDto) {
    return this.reasonsService.createGlobalReason(dto);
  }

  @UseGuards(WorkgroupsGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Workgroups(WORKGROUP_SISADMIN)
  @ApiResponse({ status: 201, type: RequestReason })
  @ApiBody({ type: CreateGlobalReasonDto })
  @Post()
  public createRequestReason(@Body() dto: CreateRequestReason) {
    return this.reasonsService.createRequestReason(dto);
  }

  @UseGuards(WorkgroupsGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Workgroups(WORKGROUP_SISADMIN)
  @ApiResponse({ status: 201, type: Program })
  @ApiBody({ type: CreateGlobalReasonDto })
  @Post('/program')
  public createProgram(@Body() dto: CreateProgram) {
    return this.reasonsService.createProgram(dto);
  }

  @UseGuards(JwtAuthenticationGuard)
  @ApiResponse({ status: 200, type: GetReasons })
  @Get()
  public get() {
    return this.reasonsService.get();
  }
}