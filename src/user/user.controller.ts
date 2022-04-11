import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtTelegramGuard } from 'src/auth/guard/jwtTelegram.guard';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';
import { ChangePasswordDto } from './dto/changePasswordDto.dto';
import { PasswordRecoveryDto } from './dto/passwordRecovery.dto';
import { UpdateUserDto } from './dto/updateUserDto.dto';
import { VerifyCodeDto } from './dto/verifyCode.dto';
import { UserService } from './user.service';

@ApiTags('Пользователь')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Генерация кода восстановления' })
  @ApiResponse({ status: 200 })
  @ApiBody({ type: PasswordRecoveryDto })
  @Post('/passwordRecovery')
  public passwordRecovery(@Body() dto: PasswordRecoveryDto) {
    return this.userService.passwordRecovery(dto);
  }

  @ApiOperation({ summary: 'Проверка кода восстановления' })
  @ApiResponse({ status: 200 })
  @ApiBody({
    type: VerifyCodeDto,
  })
  @Post('/verifyCode')
  public verifyCode(@Body() dto: VerifyCodeDto) {
    return this.userService.verifyCode(dto);
  }

  @ApiOperation({ summary: 'Смена пароля' })
  @ApiResponse({ status: 200 })
  @ApiBody({
    type: ChangePasswordDto,
  })
  @Post('/changePassword')
  public changePassword(@Body() dto: ChangePasswordDto) {
    return this.userService.changePassword(dto);
  }

  @ApiOperation({ summary: 'Обновление данных пользователя' })
  @ApiResponse({ status: 200 })
  @ApiBody({
    type: UpdateUserDto,
  })
  @UseGuards(JwtTelegramGuard)
  @Patch()
  public update(@Body() dto: UpdateUserDto, @Req() req: RequestWithUser) {
    return this.userService.update(dto, req.user);
  }
}
