import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  HttpCode
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
import { ADMIN } from 'src/consts/workgroups.names';
import { JwtTelegramGuard } from './guard/jwtTelegram.guard';

@Controller('auth')
@ApiTags('Авторизация')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Регистрация' })
  @ApiResponse({ status: 201, type: GetUserDto })
  @ApiBody({ type: CreateUserDto })
  @UseGuards(WorkgroupsGuard)
  @UseGuards(JwtTelegramGuard)
  @Workgroups(ADMIN)
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @HttpCode(200)
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

  // @UseGuards(LocalAuthenticationGuard)
  @ApiOperation({ summary: 'Выход из аккаунта' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtTelegramGuard)
  @Post('logout')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.sendStatus(200);
  }

  @UseGuards(JwtTelegramGuard)
  @ApiOperation({ summary: 'Аутентификация по токену' })
  @ApiResponse({ status: 200, type: GetUserDto })
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }
}
