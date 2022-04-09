import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/createUserDto.dto';
import { AuthService } from './auth.service';
import JwtAuthenticationGuard from './guard/jwt.guard';
import { LocalAuthenticationGuard } from './guard/local.guard';
import RequestWithUser from './interface/requestWithUser.interface';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WorkgroupsGuard } from './guard/workgroups.guard';
import { Workgroups } from './workgroups.decorator';
import { GetUserDto } from 'src/user/dto/getUserDto.dto';
import { LoginDto } from 'src/user/dto/loginDto.dto';
import { WORKGROUP_SISADMIN } from 'src/consts/workgroups.names';

@Controller('auth')
@ApiTags('Авторизация')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Регистрация' })
  @ApiResponse({ status: 201, type: GetUserDto })
  @ApiBody({ type: CreateUserDto })
  @UseGuards(WorkgroupsGuard)
  @UseGuards(JwtAuthenticationGuard)
  @Workgroups(WORKGROUP_SISADMIN)
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @UseGuards(LocalAuthenticationGuard)
  @ApiOperation({ summary: 'Вход в аккаунт' })
  @ApiResponse({ status: 200, type: GetUserDto })
  @ApiBody({ type: LoginDto })
  @Post('login')
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const user = request.user;
    const cookie = this.authService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    return response.send(user);
  }

  @UseGuards(LocalAuthenticationGuard)
  @ApiOperation({ summary: 'Выход из аккаунта' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @ApiOperation({ summary: 'Аутентификация по токену' })
  @ApiResponse({ status: 200, type: GetUserDto })
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }
}
