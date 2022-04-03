import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/auth/guard/jwt.guard';
import { WorkgroupsGuard } from 'src/auth/guard/workgroups.guard';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';
import { Workgroups } from 'src/auth/workgroups.decorator';
import { WORKGROUP_1S, WORKGROUP_SISADMIN } from 'src/consts/workgroups.names';
import { CreateRequest } from './dto/createRequest.dto';
import { CreateStage } from './dto/createStage.dto';
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
  public createRequest(
    @Body() dto: CreateRequest,
    @Req() request: RequestWithUser,
  ) {
    return this.requestService.createRequest(dto, request.user);
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
  public getmy(@Req() request: RequestWithUser) {
    return this.requestService.getMy(request.user);
  }
}
